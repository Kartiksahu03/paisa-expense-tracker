import mongoose from "mongoose";
import { CATEGORIES } from "../utils/categories.js";

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    amount: { type: Number, required: true, min: 0 },
    category: { type: String, enum: CATEGORIES, default: "Other" },
    note: { type: String, trim: true, default: "" },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
