import { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { setBudget, fetchBudget } from "../../features/budget/budgetSlice.js";
import { inr } from "../../utils/formatCurrency.js";

export default function BudgetBar({ budget }) {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(budget?.limit || "");

  const { limit = 0, used = 0, percent = 0, alert } = budget || {};
  const barColor = percent >= 100 ? "bg-expense" : percent >= 80 ? "bg-warn" : "bg-income";

  const save = async () => {
    await dispatch(setBudget({ limit: Number(value) }));
    await dispatch(fetchBudget());
    setEditing(false);
    toast.success("Budget updated");
  };

  return (
    <div className="bg-card border border-line rounded-2xl p-4 mb-3">
      <div className="flex justify-between items-baseline mb-2.5">
        <span className="text-[13px] font-medium">Budget limit</span>
        {editing ? (
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-24 bg-card2 border border-line rounded-md px-2 py-1 text-xs text-white outline-none"
              placeholder="25000"
            />
            <button onClick={save} className="text-income text-xs">Save</button>
          </div>
        ) : (
          <span className="text-xs text-muted">
            <span className={percent >= 80 ? "text-warn" : "text-income"}>{inr(used)}</span> / {inr(limit)}
            <button onClick={() => setEditing(true)} className="ml-2 text-income">Edit</button>
          </span>
        )}
      </div>
      <div className="w-full h-2 bg-card2 rounded-full overflow-hidden">
        <div className={`h-full ${barColor} rounded-full transition-all`} style={{ width: `${Math.min(percent, 100)}%` }} />
      </div>
      <div className="text-[10.5px] text-muted mt-1.5">
        {limit > 0 ? (alert || `${percent}% used`) : "Set a monthly limit to get spending alerts"}
      </div>
    </div>
  );
}
