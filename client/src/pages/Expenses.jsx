import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Plus, ArrowUpRight } from "lucide-react";
import AppLayout from "../components/layout/AppLayout.jsx";
import DailyTrendChart from "../components/dashboard/DailyTrendChart.jsx";
import CategoryChart from "../components/dashboard/CategoryChart.jsx";
import TransactionItem from "../components/transactions/TransactionItem.jsx";
import AddTransactionModal from "../components/transactions/AddTransactionModal.jsx";
import ExportButton from "../components/common/ExportButton.jsx";
import { fetchTransactions, fetchSummary, deleteTransaction } from "../features/transactions/transactionSlice.js";
import { dailySeries } from "../utils/daily.js";
import { inr } from "../utils/formatCurrency.js";

export default function Expenses() {
  const dispatch = useDispatch();
  const { items, summary } = useSelector((s) => s.transactions);
  const [open, setOpen] = useState(false);

  useEffect(() => { dispatch(fetchTransactions()); dispatch(fetchSummary()); }, [dispatch]);

  const expenseItems = items.filter((t) => t.type === "expense");
  const total = expenseItems.reduce((s, t) => s + t.amount, 0);
  const series = useMemo(() => dailySeries(items, "expense"), [items]);

  const handleDelete = async (id) => {
    await dispatch(deleteTransaction(id));
    dispatch(fetchSummary());
    toast.success("Deleted");
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl lg:text-2xl font-semibold">Expenses</h1>
          <p className="text-sm text-muted">Money going out this month</p>
        </div>
        <button onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-expense text-base font-medium px-4 py-2.5 rounded-xl">
          <Plus size={18} /> Add expense
        </button>
      </div>

      <div className="bg-card border border-line rounded-2xl p-4 mb-3 flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-expense/12 text-expense flex items-center justify-center">
          <ArrowUpRight size={22} />
        </div>
        <div>
          <div className="text-xs text-muted">Total expenses (this month)</div>
          <div className="text-2xl font-semibold">{inr(total)}</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-3 mb-3">
        <DailyTrendChart data={series} color="#f87171" title="Daily expense trend" />
        <CategoryChart byCategory={summary?.byCategory || {}} />
      </div>

      <div className="flex items-center justify-between mb-2.5 px-1">
        <span className="text-sm font-medium">Expense transactions</span>
        <ExportButton items={expenseItems} filename="expenses.csv" />
      </div>
      <div className="bg-card border border-line rounded-2xl p-3 lg:p-4">
        {expenseItems.length === 0 ? (
          <div className="text-center text-muted text-sm py-10">No expenses yet.</div>
        ) : expenseItems.map((t) => <TransactionItem key={t._id} txn={t} onDelete={handleDelete} />)}
      </div>

      {open && <AddTransactionModal defaultType="expense" onClose={() => setOpen(false)} />}
    </AppLayout>
  );
}
