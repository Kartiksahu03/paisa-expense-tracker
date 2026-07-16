import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Loader2, Sparkles } from "lucide-react";
import { aiApi } from "../../features/ai/aiApi.js";
import VoiceButton from "./VoiceButton.jsx";

const SUGGESTIONS = [
  "How can I save more this month?",
  "Why did my expenses go up?",
  "What should I cut back on?",
  "Suggest a monthly budget for me",
];

export default function AssistantPanel() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm your money assistant. Ask me anything about your spending, saving, or budget." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    const next = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      // send only user/assistant turns (skip the greeting) to the API
      const history = next.filter((m, i) => !(i === 0 && m.role === "assistant"));
      const { reply } = await aiApi.chat(history);
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Sorry, I couldn't reach the assistant. Try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed z-40 bottom-20 lg:bottom-6 right-4 lg:right-6 w-14 h-14 rounded-2xl bg-income text-base shadow-lg flex items-center justify-center"
        title="AI assistant"
      >
        {open ? <X size={24} /> : <Bot size={24} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            className="fixed z-40 bottom-36 lg:bottom-24 right-4 lg:right-6 w-[calc(100vw-2rem)] max-w-sm h-[28rem] bg-card border border-line rounded-3xl flex flex-col overflow-hidden shadow-2xl"
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-line">
              <div className="w-8 h-8 rounded-xl bg-income/15 text-income flex items-center justify-center">
                <Sparkles size={16} />
              </div>
              <div className="text-sm font-medium">Money Assistant</div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] text-[13px] leading-relaxed px-3 py-2 rounded-2xl ${
                    m.role === "user" ? "bg-income/15 text-white rounded-br-sm" : "bg-card2 text-[#c7ccd4] rounded-bl-sm"
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-card2 px-3 py-2 rounded-2xl"><Loader2 size={16} className="animate-spin text-income" /></div>
                </div>
              )}
              {messages.length <= 1 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} onClick={() => send(s)}
                      className="text-[11px] text-income border border-income/25 rounded-full px-2.5 py-1 hover:bg-income/10">
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 p-2.5 border-t border-line">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask about your money…"
                className="flex-1 bg-card2 border border-line rounded-xl px-3 py-2 text-[13px] outline-none focus:border-income/50"
              />
              <VoiceButton onText={(t) => send(t)} size={38} />
              <button onClick={() => send()} disabled={loading}
                className="w-9 h-9 rounded-xl bg-income flex items-center justify-center disabled:opacity-60">
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
