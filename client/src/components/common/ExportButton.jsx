import { Download } from "lucide-react";

export default function ExportButton({ items = [], filename = "transactions.csv" }) {
  const exportCsv = () => {
    const header = ["Date", "Type", "Category", "Note", "Amount"];
    const rows = items.map((t) => [
      new Date(t.date).toLocaleDateString("en-IN"),
      t.type, t.category, (t.note || "").replace(/,/g, " "), t.amount,
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <button onClick={exportCsv}
      className="flex items-center gap-1.5 text-xs border border-line px-3 py-2 rounded-lg text-muted hover:text-white hover:bg-card2">
      <Download size={14} /> Export
    </button>
  );
}
