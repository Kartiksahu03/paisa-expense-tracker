import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";

export default function IncomeExpenseChart({ monthly = [] }) {
  return (
    <div className="bg-card border border-line rounded-2xl p-4 lg:p-5 h-full">
      <div className="flex justify-between items-baseline mb-4">
        <span className="text-sm font-medium">Income vs Expense</span>
        <span className="text-[11px] text-muted">Last 6 months</span>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthly} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: "#9aa0aa", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#9aa0aa", fontSize: 11 }} axisLine={false} tickLine={false}
              tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)} />
            <Tooltip
              contentStyle={{ background: "#1c2129", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }}
              labelStyle={{ color: "#f2f4f7" }}
              formatter={(v, n) => [`₹${Number(v).toLocaleString("en-IN")}`, n]}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" />
            <Bar dataKey="income" name="Income" fill="#34d399" radius={[4, 4, 0, 0]} maxBarSize={22} />
            <Bar dataKey="expense" name="Expense" fill="#f87171" radius={[4, 4, 0, 0]} maxBarSize={22} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
