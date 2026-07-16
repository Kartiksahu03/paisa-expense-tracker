import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { User, Target, TrendingUp, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout.jsx";
import { fetchBudget, setBudget } from "../features/budget/budgetSlice.js";
import { fetchSummary } from "../features/transactions/transactionSlice.js";
import { logout } from "../features/auth/authSlice.js";
import { useAuth } from "../hooks/useAuth.js";
import { inr } from "../utils/formatCurrency.js";

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useAuth();
  const budget = useSelector((s) => s.budget.data);
  const summary = useSelector((s) => s.transactions.summary);
  const [limit, setLimit] = useState("");

  useEffect(() => { dispatch(fetchBudget()); dispatch(fetchSummary()); }, [dispatch]);
  useEffect(() => { if (budget?.limit) setLimit(budget.limit); }, [budget]);

  const saveLimit = async () => {
    if (!limit || Number(limit) <= 0) return toast.error("Enter a valid limit");
    await dispatch(setBudget({ limit: Number(limit) }));
    await dispatch(fetchBudget());
    toast.success("Budget saved");
  };

  const initials = user?.name ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "U";

  return (
    <AppLayout>
      <h1 className="text-xl lg:text-2xl font-semibold mb-5">Profile</h1>

      <div className="bg-card border border-line rounded-2xl p-5 mb-3 flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-income/15 text-income flex items-center justify-center text-xl font-semibold">
          {initials}
        </div>
        <div>
          <div className="text-lg font-medium">{user?.name}</div>
          <div className="text-sm text-muted">{user?.email}</div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mb-3">
        <div className="bg-card border border-line rounded-2xl p-4">
          <div className="flex items-center gap-2 text-income mb-2"><TrendingUp size={18} /><span className="text-sm">Saving rate</span></div>
          <div className="text-2xl font-semibold">{summary?.savingRate ?? 0}%</div>
        </div>
        <div className="bg-card border border-line rounded-2xl p-4">
          <div className="flex items-center gap-2 text-warn mb-2"><Target size={18} /><span className="text-sm">This month spent</span></div>
          <div className="text-2xl font-semibold">{inr(summary?.expense || 0)}</div>
        </div>
      </div>

      <div className="bg-card border border-line rounded-2xl p-5 mb-3">
        <div className="flex items-center gap-2 mb-3"><Target size={18} className="text-income" /><span className="font-medium">Monthly budget limit</span></div>
        <p className="text-xs text-muted mb-3">Set a monthly cap and get alerts at 50%, 80% and 100%.</p>
        <div className="flex gap-2">
          <input type="number" value={limit} onChange={(e) => setLimit(e.target.value)} placeholder="e.g. 25000"
            className="flex-1 bg-card2 border border-line rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-income/50" />
          <button onClick={saveLimit} className="bg-income text-base font-medium px-5 rounded-xl">Save</button>
        </div>
      </div>

      <button onClick={() => { dispatch(logout()); navigate("/login"); }}
        className="flex items-center gap-2 text-sm text-expense border border-line rounded-xl px-4 py-2.5">
        <LogOut size={16} /> Log out
      </button>
    </AppLayout>
  );
}
