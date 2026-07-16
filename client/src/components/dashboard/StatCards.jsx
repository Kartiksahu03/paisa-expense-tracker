import { motion } from "framer-motion";
import { Wallet, ArrowDownLeft, ArrowUpRight, PiggyBank } from "lucide-react";
import { inr } from "../../utils/formatCurrency.js";

export default function StatCards({ summary }) {
  const { balance = 0, income = 0, expense = 0, savingRate = 0 } = summary || {};
  const cards = [
    { label: "Total balance", value: inr(balance), icon: Wallet, tone: "text-white", bg: "bg-card2" },
    { label: "Income", value: inr(income), icon: ArrowDownLeft, tone: "text-income", bg: "bg-income/10" },
    { label: "Expenses", value: inr(expense), icon: ArrowUpRight, tone: "text-expense", bg: "bg-expense/10" },
    { label: "Saving rate", value: `${savingRate}%`, icon: PiggyBank, tone: "text-warn", bg: "bg-warn/10" },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
      {cards.map((c, i) => (
        <motion.div
          key={c.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="bg-card border border-line rounded-2xl p-4"
        >
          <div className={`w-9 h-9 rounded-xl ${c.bg} ${c.tone} flex items-center justify-center mb-3`}>
            <c.icon size={18} />
          </div>
          <div className="text-xs text-muted">{c.label}</div>
          <div className="text-xl lg:text-2xl font-semibold mt-0.5">{c.value}</div>
        </motion.div>
      ))}
    </div>
  );
}
