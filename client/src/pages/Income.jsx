import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Plus, ArrowDownLeft } from "lucide-react";
import AppLayout from "../components/layout/AppLayout.jsx";
import DailyTrendChart from "../components/dashboard/DailyTrendChart.jsx";
import TransactionItem from "../components/transactions/TransactionItem.jsx";
import AddTransactionModal from "../components/transactions/AddTransactionModal.jsx";
import ExportButton from "../components/common/ExportButton.jsx";
import { fetchTransactions, fetchSummary, deleteTransaction } from "../features/transactions/transactionSlice.js";
import { dailySeries } from "../utils/daily.js";
import { inr } from "../utils/formatCurrency.js";

export default function Income() {
  const dispatch = useDispatch();
  const { items } = useSelector((s) => s.transactions);
  const [open, setOpen] = useState(false);

  useEffect(() => { dispatch(fetchTransactions()); }, [dispatch]);

  const incomeItems = items.filter((t) => t.type === "income");
  const total = incomeItems.reduce((s, t) => s + t.amount, 0);
  const series = useMemo(() => dailySeries(items, "income"), [items]);

  const handleDelete = async (id) => {
    await dispatch(deleteTransaction(id));
    dispatch(fetchSummary());
    toast.success("Deleted");
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl lg:text-2xl font-semibold">Income</h1>
          <p className="text-sm text-muted">Money coming in this month</p>
        </div>
        <button onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-income text-base font-medium px-4 py-2.5 rounded-xl">
          <Plus size={18} /> Add income
        </button>
      </div>

      <div className="bg-card border border-line rounded-2xl p-4 mb-3 flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-income/12 text-income flex items-center justify-center">
          <ArrowDownLeft size={22} />
        </div>
        <div>
          <div className="text-xs text-muted">Total income (this month)</div>
          <div className="text-2xl font-semibold">{inr(total)}</div>
        </div>
      </div>

      <div className="mb-3">
        <DailyTrendChart data={series} color="#34d399" title="Daily income trend" />
      </div>

      <div className="flex items-center justify-between mb-2.5 px-1">
        <span className="text-sm font-medium">Income transactions</span>
        <ExportButton items={incomeItems} filename="income.csv" />
      </div>
      <div className="bg-card border border-line rounded-2xl p-3 lg:p-4">
        {incomeItems.length === 0 ? (
          <div className="text-center text-muted text-sm py-10">No income yet. Add your salary or other income.</div>
        ) : incomeItems.map((t) => <TransactionItem key={t._id} txn={t} onDelete={handleDelete} />)}
      </div>

      {open && <AddTransactionModal defaultType="income" onClose={() => setOpen(false)} />}
    </AppLayout>
  );
}
