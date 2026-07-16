import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function DailyTrendChart({ data = [], color = "#34d399", title = "Daily trend" }) {
  return (
    <div className="bg-card border border-line rounded-2xl p-4 lg:p-5">
      <div className="flex justify-between items-baseline mb-4">
        <span className="text-sm font-medium">{title}</span>
        <span className="text-[11px] text-muted">This month</span>
      </div>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="day" tick={{ fill: "#9aa0aa", fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
            <YAxis tick={{ fill: "#9aa0aa", fontSize: 10 }} axisLine={false} tickLine={false}
              tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)} />
            <Tooltip
              contentStyle={{ background: "#1c2129", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }}
              labelFormatter={(d) => `Day ${d}`}
              formatter={(v) => [`₹${Number(v).toLocaleString("en-IN")}`, "Amount"]}
            />
            <Area type="monotone" dataKey="amount" stroke={color} strokeWidth={2} fill={`url(#grad-${color})`} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
