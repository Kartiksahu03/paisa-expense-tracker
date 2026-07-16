import Transaction from "../models/Transaction.js";

// Helper: start/end of a "YYYY-MM" month
const monthRange = (month) => {
  const [y, m] = month.split("-").map(Number);
  const start = new Date(y, m - 1, 1);
  const end = new Date(y, m, 1);
  return { start, end };
};

const currentMonth = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

// GET /api/transactions?month=YYYY-MM   (month optional -> all)
export const getTransactions = async (req, res) => {
  const filter = { user: req.user._id };
  if (req.query.month) {
    const { start, end } = monthRange(req.query.month);
    filter.date = { $gte: start, $lt: end };
  }
  const txns = await Transaction.find(filter).sort({ date: -1 });
  res.json(txns);
};

// POST /api/transactions
export const addTransaction = async (req, res) => {
  const { type, amount, category, note, date } = req.body;
  if (!type || amount == null)
    return res.status(400).json({ message: "type and amount are required" });

  const txn = await Transaction.create({
    user: req.user._id,
    type,
    amount,
    category: category || "Other",
    note: note || "",
    date: date || Date.now(),
  });
  res.status(201).json(txn);
};

// DELETE /api/transactions/:id
export const deleteTransaction = async (req, res) => {
  const txn = await Transaction.findOne({ _id: req.params.id, user: req.user._id });
  if (!txn) return res.status(404).json({ message: "Transaction not found" });
  await txn.deleteOne();
  res.json({ message: "Deleted", id: req.params.id });
};

// GET /api/transactions/summary  -> everything the dashboard needs
export const getSummary = async (req, res) => {
  const userId = req.user._id;
  const month = req.query.month || currentMonth();
  const { start, end } = monthRange(month);

  const monthTxns = await Transaction.find({
    user: userId,
    date: { $gte: start, $lt: end },
  });

  const income = monthTxns
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const expense = monthTxns
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  // Spend by category (expenses only)
  const byCategory = {};
  monthTxns
    .filter((t) => t.type === "expense")
    .forEach((t) => (byCategory[t.category] = (byCategory[t.category] || 0) + t.amount));

  // Last 6 months: income + expense per month (for the analytics chart)
  const monthly = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const s = new Date(d.getFullYear(), d.getMonth(), 1);
    const e = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    const txns = await Transaction.find({
      user: userId,
      date: { $gte: s, $lt: e },
    });
    const inc = txns.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
    const exp = txns.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
    monthly.push({
      label: d.toLocaleString("en-IN", { month: "short" }),
      income: inc,
      expense: exp,
      total: exp,
    });
  }

  const savingRate = income > 0 ? Math.round(((income - expense) / income) * 100) : 0;

  res.json({
    month,
    income,
    expense,
    balance: income - expense,
    savingRate,
    byCategory,
    monthly,
  });
};
