import Budget from "../models/Budget.js";
import Transaction from "../models/Transaction.js";

const currentMonth = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const monthRange = (month) => {
  const [y, m] = month.split("-").map(Number);
  return { start: new Date(y, m - 1, 1), end: new Date(y, m, 1) };
};

// PUT /api/budget   { month?, limit }  -> create or update
export const setBudget = async (req, res) => {
  const month = req.body.month || currentMonth();
  const { limit } = req.body;
  if (limit == null) return res.status(400).json({ message: "limit is required" });

  const budget = await Budget.findOneAndUpdate(
    { user: req.user._id, month },
    { limit },
    { new: true, upsert: true }
  );
  res.json(budget);
};

// GET /api/budget?month=YYYY-MM  -> limit + how much used + alert level
export const getBudget = async (req, res) => {
  const month = req.query.month || currentMonth();
  const budget = await Budget.findOne({ user: req.user._id, month });

  const { start, end } = monthRange(month);
  const txns = await Transaction.find({
    user: req.user._id,
    type: "expense",
    date: { $gte: start, $lt: end },
  });
  const used = txns.reduce((s, t) => s + t.amount, 0);

  const limit = budget?.limit || 0;
  const percent = limit > 0 ? Math.round((used / limit) * 100) : 0;

  // alert thresholds
  let alert = null;
  if (limit > 0) {
    if (percent >= 100) alert = "You've hit your monthly limit.";
    else if (percent >= 80) alert = "You're at 80% of your budget.";
    else if (percent >= 50) alert = "You've used half your budget.";
  }

  res.json({ month, limit, used, percent, alert });
};
