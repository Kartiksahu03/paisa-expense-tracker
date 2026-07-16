import { useState } from "react";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { X, Sparkles, Loader2, Plus } from "lucide-react";
import { CATEGORIES } from "../../utils/constants.js";
import { addTransaction, fetchTransactions, fetchSummary } from "../../features/transactions/transactionSlice.js";
import { aiAdd, fetchInsight } from "../../features/ai/aiSlice.js";
import { fetchBudget } from "../../features/budget/budgetSlice.js";
import VoiceButton from "../ai/VoiceButton.jsx";

export default function AddTransactionModal({ onClose, defaultType = "expense" }) {
  const dispatch = useDispatch();
  const [mode, setMode] = useState("manual"); // "manual" | "ai"
  const [type, setType] = useState(defaultType);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [note, setNote] = useState("");
  const [aiText, setAiText] = useState("");
  const [loading, setLoading] = useState(false);

  const refreshAll = () => {
    dispatch(fetchTransactions());
    dispatch(fetchSummary());
    dispatch(fetchBudget());
    dispatch(fetchInsight());
  };

  const saveManual = async () => {
    if (!amount || Number(amount) <= 0) return toast.error("Enter a valid amount");
    setLoading(true);
    await dispatch(addTransaction({
      type,
      amount: Number(amount),
      category: type === "income" ? "Income" : category,
      note,
    }));
    setLoading(false);
    toast.success(`${type === "income" ? "Income" : "Expense"} added`);
    refreshAll();
    onClose();
  };

  const saveAi = async (text) => {
    const value = (text ?? aiText).trim();
    if (!value) return;
    setLoading(true);
    const res = await dispatch(aiAdd(value));
    setLoading(false);
    if (res.error) return toast.error(res.payload || "Couldn't understand that");
    const { parsed } = res.payload;
    toast.success(`Added ${parsed.type}: ₹${parsed.amount} (${parsed.category})`);
    refreshAll();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center bg-black/50 p-0 lg:p-6" onClick={onClose}>
      <AnimatePresence>
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-card border border-line rounded-t-3xl lg:rounded-3xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-medium">Add transaction</h2>
            <button onClick={onClose} className="text-muted hover:text-white"><X size={20} /></button>
          </div>

          {/* mode switch */}
          <div className="flex gap-1 bg-card2 rounded-xl p-1 mb-4">
            <button onClick={() => setMode("manual")}
              className={`flex-1 py-2 rounded-lg text-sm ${mode === "manual" ? "bg-base text-white" : "text-muted"}`}>
              Manual
            </button>
            <button onClick={() => setMode("ai")}
              className={`flex-1 py-2 rounded-lg text-sm flex items-center justify-center gap-1.5 ${mode === "ai" ? "bg-base text-white" : "text-muted"}`}>
              <Sparkles size={14} className="text-income" /> AI / Voice
            </button>
          </div>

          {mode === "manual" ? (
            <div className="space-y-3">
              {/* income / expense toggle — the clear in vs out control */}
              <div className="flex gap-2">
                <button onClick={() => setType("expense")}
                  className={`flex-1 py-2.5 rounded-xl text-sm border ${type === "expense" ? "bg-expense/15 border-expense/40 text-expense" : "border-line text-muted"}`}>
                  Expense (out)
                </button>
                <button onClick={() => setType("income")}
                  className={`flex-1 py-2.5 rounded-xl text-sm border ${type === "income" ? "bg-income/15 border-income/40 text-income" : "border-line text-muted"}`}>
                  Income (in)
                </button>
              </div>

              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount (₹)"
                className="w-full bg-card2 border border-line rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-income/50" />

              {type === "expense" && (
                <select value={category} onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-card2 border border-line rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-income/50">
                  {CATEGORIES.filter((c) => c !== "Income").map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              )}

              <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note (optional)"
                className="w-full bg-card2 border border-line rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-income/50" />

              <button onClick={saveManual} disabled={loading}
                className="w-full bg-income text-base font-medium py-2.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />} Add
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-muted">
                Type or speak in plain words. Try "20000 in SIP" or "got 45000 salary" — the AI figures out
                the amount, category, and whether it's money in or out.
              </p>
              <div className="flex items-center gap-2 bg-card2 border border-line rounded-xl pl-3.5 pr-2 py-2">
                <Sparkles size={16} className="text-income shrink-0" />
                <input value={aiText} onChange={(e) => setAiText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveAi()}
                  placeholder="spent 250 on lunch…"
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted" />
                <VoiceButton onText={(t) => { setAiText(t); saveAi(t); }} />
              </div>
              <button onClick={() => saveAi()} disabled={loading}
                className="w-full bg-income text-base font-medium py-2.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />} Add with AI
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
