import { Sparkles } from "lucide-react";

export default function InsightCard({ insight }) {
  if (!insight) return null;
  return (
    <div className="bg-card border border-income/25 rounded-2xl p-3.5 mb-3 flex gap-3">
      <Sparkles size={18} className="text-income mt-0.5 shrink-0" />
      <div>
        <div className="text-xs text-income font-medium mb-0.5">AI insight</div>
        <div className="text-[12.5px] text-[#c7ccd4] leading-relaxed">{insight}</div>
      </div>
    </div>
  );
}
