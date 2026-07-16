import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { inr } from "../../utils/formatCurrency.js";

const COLORS = ["#34d399", "#f87171", "#fbbf24", "#60a5fa", "#a78bfa", "#f472b6", "#2dd4bf", "#fb923c", "#94a3b8"];

export default function CategoryChart({ byCategory = {} }) {
  const data = Object.entries(byCategory)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="bg-card border border-line rounded-2xl p-4 lg:p-5 h-full">
      <div className="text-sm font-medium mb-4">Spending by category</div>
      {data.length === 0 ? (
        <div className="text-center text-muted text-xs py-16">No expenses yet this month.</div>
      ) : (
        <div className="flex items-center gap-4">
          <div className="w-32 h-32 shrink-0 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="value" innerRadius={40} outerRadius={62} paddingAngle={2} stroke="none">
                  {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "#1c2129", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }}
                  formatter={(v) => `₹${Number(v).toLocaleString("en-IN")}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 min-w-0 space-y-1.5">
            {data.slice(0, 6).map((d, i) => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                <span className="flex-1 truncate text-muted">{d.name}</span>
                <span>{inr(d.value)}</span>
                <span className="text-muted w-9 text-right">{total ? Math.round((d.value / total) * 100) : 0}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
