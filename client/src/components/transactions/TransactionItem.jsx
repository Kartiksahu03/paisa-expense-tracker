import { motion } from "framer-motion";
import {
  UtensilsCrossed, ShoppingCart, Plane, ShoppingBag,
  FileText, Clapperboard, HeartPulse, Wallet, MoreHorizontal, Trash2,
} from "lucide-react";
import { inr } from "../../utils/formatCurrency.js";

const ICONS = {
  Food: UtensilsCrossed, Market: ShoppingCart, Travel: Plane, Shopping: ShoppingBag,
  Bills: FileText, Entertainment: Clapperboard, Health: HeartPulse, Income: Wallet, Other: MoreHorizontal,
};

export default function TransactionItem({ txn, onDelete }) {
  const Icon = ICONS[txn.category] || MoreHorizontal;
  const isIncome = txn.type === "income";
  const date = new Date(txn.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className="group flex items-center gap-3 py-2.5 px-1 border-t border-line first:border-t-0"
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isIncome ? "bg-income/12 text-income" : "bg-expense/12 text-expense"}`}>
        <Icon size={17} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] truncate">{txn.note || txn.category}</div>
        <div className="text-[11px] text-muted">{txn.category} · {date}</div>
      </div>
      <div className={`text-[13px] ${isIncome ? "text-income" : "text-expense"}`}>
        {isIncome ? "+" : "-"}{inr(txn.amount)}
      </div>
      <button
        onClick={() => onDelete(txn._id)}
        className="text-muted hover:text-expense opacity-0 group-hover:opacity-100 transition-opacity"
        title="Delete"
      >
        <Trash2 size={15} />
      </button>
    </motion.div>
  );
}
