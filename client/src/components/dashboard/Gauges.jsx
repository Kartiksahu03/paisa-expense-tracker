import { inr } from "../../utils/formatCurrency.js";

function Gauge({ label, value, pct, color }) {
  const r = 46, cx = 60, cy = 54, len = Math.PI * r;
  const dash = Math.max(0, Math.min(1, pct || 0)) * len;
  const arc = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
  return (
    <div className="flex flex-col items-center bg-card border border-line rounded-2xl p-4">
      <svg width="120" height="64" viewBox="0 0 120 64">
        <path d={arc} fill="none" stroke="#242a33" strokeWidth="9" strokeLinecap="round" />
        <path d={arc} fill="none" stroke={color} strokeWidth="9" strokeLinecap="round"
          strokeDasharray={`${dash} ${len}`} />
      </svg>
      <div className="-mt-3 text-lg font-semibold">{value}</div>
      <div className="text-[11px] text-muted">{label}</div>
    </div>
  );
}

export default function Gauges({ summary }) {
  const { income = 0, expense = 0 } = summary || {};
  const savings = Math.max(income - expense, 0);
  const base = income || 1;
  return (
    <div className="grid grid-cols-3 gap-3 mb-3">
      <Gauge label="Income" value={inr(income)} pct={1} color="#34d399" />
      <Gauge label="Spent" value={inr(expense)} pct={expense / base} color="#f87171" />
      <Gauge label="Savings" value={inr(savings)} pct={savings / base} color="#60a5fa" />
    </div>
  );
}
