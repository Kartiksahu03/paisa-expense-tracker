import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import AppLayout from "../components/layout/AppLayout.jsx";
import StatCards from "../components/dashboard/StatCards.jsx";
import Gauges from "../components/dashboard/Gauges.jsx";
import IncomeExpenseChart from "../components/dashboard/IncomeExpenseChart.jsx";
import CategoryChart from "../components/dashboard/CategoryChart.jsx";
import DailyTrendChart from "../components/dashboard/DailyTrendChart.jsx";
import BudgetBar from "../components/dashboard/BudgetBar.jsx";
import InsightCard from "../components/ai/InsightCard.jsx";
import TransactionList from "../components/transactions/TransactionList.jsx";
import { fetchTransactions, fetchSummary, deleteTransaction } from "../features/transactions/transactionSlice.js";
import { fetchBudget } from "../features/budget/budgetSlice.js";
import { fetchInsight } from "../features/ai/aiSlice.js";
import { dailySeries } from "../utils/daily.js";
import { useAuth } from "../hooks/useAuth.js";

export default function Dashboard() {
  const dispatch = useDispatch();
  const user = useAuth();
  const { items, summary } = useSelector((s) => s.transactions);
  const budget = useSelector((s) => s.budget.data);
  const insight = useSelector((s) => s.ai.insight);

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchSummary());
    dispatch(fetchBudget());
    dispatch(fetchInsight());
  }, [dispatch]);

  const expenseSeries = useMemo(() => dailySeries(items, "expense"), [items]);

  const handleDelete = async (id) => {
    await dispatch(deleteTransaction(id));
    dispatch(fetchSummary());
    dispatch(fetchBudget());
    toast.success("Deleted");
  };

  return (
    <AppLayout>
      <div className="mb-5">
        <h1 className="text-xl lg:text-2xl font-semibold">Hi {user?.name?.split(" ")[0] || "there"} 👋</h1>
        <p className="text-sm text-muted">Here's your money at a glance.</p>
      </div>

      <StatCards summary={summary} />
      <InsightCard insight={insight} />
      <Gauges summary={summary} />

      <div className="grid lg:grid-cols-2 gap-3 mb-3">
        <IncomeExpenseChart monthly={summary?.monthly || []} />
        <CategoryChart byCategory={summary?.byCategory || {}} />
      </div>

      <div className="mb-3">
        <DailyTrendChart data={expenseSeries} color="#f87171" title="Daily expense trend" />
      </div>

      <BudgetBar budget={budget} />

      <div className="mt-3">
        <TransactionList items={items} onDelete={handleDelete} />
      </div>
    </AppLayout>
  );
}
