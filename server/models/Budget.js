import mongoose from "mongoose";

// One budget limit per user per month (e.g. month = "2026-07")
const budgetSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    month: { type: String, required: true }, // "YYYY-MM"
    limit: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

budgetSchema.index({ user: 1, month: 1 }, { unique: true });

export default mongoose.model("Budget", budgetSchema);
