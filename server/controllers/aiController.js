import { parseTransaction, generateInsight, chatAssistant } from "../services/aiService.js";
import Transaction from "../models/Transaction.js";

const monthRange = (month) => {
  const [y, m] = month.split("-").map(Number);
  return { start: new Date(y, m - 1, 1), end: new Date(y, m, 1) };
};
const currentMonth = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

// POST /api/ai/add   { text }
// Parses natural language -> creates a transaction -> returns it.
export const aiAddTransaction = async (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) return res.status(400).json({ message: "text is required" });

  try {
    const parsed = await parseTransaction(text.trim());
    const txn = await Transaction.create({
      user: req.user._id,
      type: parsed.type,
      amount: parsed.amount,
      category: parsed.category,
      note: parsed.note || text.trim(),
    });
    res.status(201).json({ parsed, transaction: txn });
  } catch (err) {
    res.status(500).json({ message: "Could not understand that. Try rephrasing." });
  }
};

// GET /api/ai/insight  -> the monthly AI summary + saving tip
export const aiInsight = async (req, res) => {
  const userId = req.user._id;
  const thisM = currentMonth();
  const now = new Date();
  const lastM = `${now.getFullYear()}-${String(now.getMonth()).padStart(2, "0") || "12"}`;

  const sum = async (month, type) => {
    const { start, end } = monthRange(month);
    const q = { user: userId, date: { $gte: start, $lt: end } };
    if (type) q.type = type;
    const txns = await Transaction.find(q);
    return txns;
  };

  const thisExpenseTxns = await sum(thisM, "expense");
  const lastExpenseTxns = await sum(lastM, "expense");
  const thisIncomeTxns = await sum(thisM, "income");

  const total = (arr) => arr.reduce((s, t) => s + t.amount, 0);

  // top category this month
  const byCat = {};
  thisExpenseTxns.forEach((t) => (byCat[t.category] = (byCat[t.category] || 0) + t.amount));
  const top = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0] || ["Other", 0];

  const summary = {
    thisMonthExpense: total(thisExpenseTxns),
    lastMonthExpense: total(lastExpenseTxns),
    topCategory: top[0],
    topCategoryAmount: top[1],
    income: total(thisIncomeTxns),
  };

  try {
    const insight = await generateInsight(summary);
    res.json({ insight, summary });
  } catch (err) {
    res.json({
      insight: `You've spent ₹${summary.thisMonthExpense} this month, mostly on ${summary.topCategory}.`,
      summary,
    });
  }
};

// POST /api/ai/chat  { messages: [{role, content}] }
// Conversational assistant grounded in the user's real numbers.
export const aiChat = async (req, res) => {
  const { messages } = req.body;
  if (!Array.isArray(messages) || messages.length === 0)
    return res.status(400).json({ message: "messages array is required" });

  const userId = req.user._id;
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const monthTxns = await Transaction.find({ user: userId, date: { $gte: start, $lt: end } }).sort({ date: -1 });
  const income = monthTxns.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = monthTxns.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);

  const byCat = {};
  monthTxns.filter((t) => t.type === "expense").forEach((t) => (byCat[t.category] = (byCat[t.category] || 0) + t.amount));
  const topCategories = Object.entries(byCat).sort((a, b) => b[1] - a[1]).slice(0, 4)
    .map(([c, a]) => `${c} ₹${a}`).join(", ");

  const recentList = monthTxns.slice(0, 6)
    .map((t) => `${t.type === "income" ? "+" : "-"}₹${t.amount} ${t.category}${t.note ? " (" + t.note + ")" : ""}`)
    .join("; ");

  // budget
  const { default: Budget } = await import("../models/Budget.js");
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const budget = await Budget.findOne({ user: userId, month: monthKey });

  const context = {
    income, expense, balance: income - expense,
    savingRate: income > 0 ? Math.round(((income - expense) / income) * 100) : 0,
    budgetLimit: budget?.limit || 0,
    budgetUsed: expense,
    topCategories,
    recentList,
  };

  try {
    const reply = await chatAssistant(context, messages);
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ message: "Assistant is unavailable right now." });
  }
};
