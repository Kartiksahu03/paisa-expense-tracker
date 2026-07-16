import Groq from "groq-sdk";
import { CATEGORIES } from "../utils/categories.js";

const MODEL = "llama-3.3-70b-versatile";

let _groq;
const getGroq = () => {
  if (!_groq) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is missing. Add it to server/.env");
    }
    _groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return _groq;
};

export const parseTransaction = async (text) => {
  const prompt = `You convert one line of text into a JSON transaction for an Indian expense tracker (rupees).

DIRECTION RULES (very important):
- type "expense" = money LEAVING the account (balance goes down). This includes:
  spending, paying, buying, bills, recharge, AND investments like SIP, mutual funds,
  stocks, FD, "put/invested in X". Money going INTO an investment is still an OUTFLOW.
- type "income" = money COMING IN (balance goes up): salary, refund, cashback, bonus,
  interest received, "got paid", "received", "credited to me".
- If genuinely unclear, use "expense".

OTHER RULES:
- "amount": positive number, rupees, no symbol.
- "category": MUST be one of: ${CATEGORIES.join(", ")}.
  (Use "Investment" for SIP / mutual funds / stocks / FD.)
- "note": short label (merchant or reason), else "".

Return ONLY valid JSON. No markdown.

Examples:
"20000 in SIP" -> {"type":"expense","amount":20000,"category":"Investment","note":"SIP"}
"invested 5000 in mutual funds" -> {"type":"expense","amount":5000,"category":"Investment","note":"Mutual funds"}
"got 45000 salary" -> {"type":"income","amount":45000,"category":"Income","note":"Salary"}
"spent 250 on lunch at dominos" -> {"type":"expense","amount":250,"category":"Food","note":"Dominos"}
"paid 1800 electricity bill" -> {"type":"expense","amount":1800,"category":"Bills","note":"Electricity"}
"refund 600 from amazon" -> {"type":"income","amount":600,"category":"Income","note":"Amazon refund"}

Now convert this line:
"${text}"`;

  const completion = await getGroq().chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.1,
    response_format: { type: "json_object" },
  });

  const parsed = JSON.parse(completion.choices[0].message.content);
  if (!CATEGORIES.includes(parsed.category)) parsed.category = "Other";
  if (parsed.type !== "income" && parsed.type !== "expense") parsed.type = "expense";
  parsed.amount = Math.abs(Number(parsed.amount)) || 0;
  return parsed;
};

export const generateInsight = async (summary) => {
  const prompt = `You are a friendly personal finance coach for an Indian user (currency ₹).
Data:
- This month spent: ₹${summary.thisMonthExpense}
- Last month spent: ₹${summary.lastMonthExpense}
- Top category: ${summary.topCategory} (₹${summary.topCategoryAmount})
- Income this month: ₹${summary.income}

Write 2 short sentences: (1) how this month compares to last, (2) one concrete saving tip based on the top category. Under 45 words. Plain text, use ₹.`;

  const completion = await getGroq().chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.6,
  });
  return completion.choices[0].message.content.trim();
};

/**
 * Conversational finance assistant. Answers the user's questions using their
 * real financial snapshot (built in the controller) as grounding context.
 */
export const chatAssistant = async (context, messages) => {
  const system = `You are Paisa, a friendly and practical personal finance assistant for an Indian user. Currency is ₹ (rupees).

The user's current snapshot (use these real numbers, do not invent):
- This month income: ₹${context.income}
- This month expenses: ₹${context.expense}
- Balance: ₹${context.balance}
- Saving rate: ${context.savingRate}%
- Budget limit: ${context.budgetLimit ? "₹" + context.budgetLimit : "not set"} (used ₹${context.budgetUsed})
- Top spending categories this month: ${context.topCategories || "none yet"}
- Recent transactions: ${context.recentList || "none yet"}

Rules:
- Give specific, practical, actionable advice grounded in THESE numbers.
- When suggesting savings, reference their actual categories and give concrete ₹ amounts.
- Be concise (under 120 words). Use ₹. Simple, friendly language. No markdown headtings.
- If they ask what they "should have done", point at the specific category that drove spending.
- Never invent transactions or numbers that aren't in the snapshot.`;

  const completion = await getGroq().chat.completions.create({
    model: MODEL,
    messages: [{ role: "system", content: system }, ...messages],
    temperature: 0.6,
    max_tokens: 400,
  });
  return completion.choices[0].message.content.trim();
};
