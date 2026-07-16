import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Wallet, Sparkles, Mic, PieChart, Bell, TrendingUp,
  Github, ExternalLink, ArrowRight, Check,
} from "lucide-react";

/* ── EDIT THESE with your real links once deployed ── */
const GITHUB_URL = "https://github.com/Kartiksahu03";
const LIVE_URL = "https://your-paisa-live-url.vercel.app";
const BUILDER = "Kartik Sahu";
const PORTFOLIO_URL = "https://kartik-s-portfolio-tau.vercel.app";

const fade = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="flex items-center justify-between px-5 lg:px-10 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-income/15 flex items-center justify-center text-income">
            <Wallet size={18} />
          </div>
          <span className="font-semibold">Paisa</span>
        </div>
        <div className="flex items-center gap-3">
          <a href={GITHUB_URL} target="_blank" rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-sm text-muted hover:text-white">
            <Github size={16} /> Code
          </a>
          <Link to="/login" className="text-sm text-muted hover:text-white">Log in</Link>
          <Link to="/register" className="bg-income text-base text-sm font-medium px-4 py-2 rounded-lg">Sign up</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-3xl mx-auto text-center px-5 pt-14 lg:pt-24">
        <motion.div {...fade}>
          <span className="inline-flex items-center gap-1.5 text-xs text-income bg-income/10 border border-income/20 px-3 py-1 rounded-full mb-6">
            <Sparkles size={13} /> AI + voice powered
          </span>
          <h1 className="text-4xl lg:text-6xl font-semibold tracking-tight leading-tight">
            Track money by just <span className="text-income">talking</span> to it
          </h1>
          <p className="text-muted text-base lg:text-lg mt-5 leading-relaxed max-w-xl mx-auto">
            Say or type "20,000 in SIP" and Paisa logs it, knows it's an investment going out,
            categorizes it, and coaches you on saving — all in ₹, on one clean dashboard.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <Link to="/register" className="bg-income text-base font-medium px-6 py-3 rounded-xl flex items-center gap-2">
              Start free <ArrowRight size={18} />
            </Link>
            <a href={LIVE_URL} target="_blank" rel="noreferrer"
              className="border border-line px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-card">
              <ExternalLink size={17} /> Live demo
            </a>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer"
              className="border border-line px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-card">
              <Github size={17} /> Source
            </a>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-5 pt-20 lg:pt-28">
        <h2 className="text-center text-2xl lg:text-3xl font-semibold mb-3">Everything, minus the busywork</h2>
        <p className="text-center text-muted mb-10">No fiddly forms. Just tell it what happened.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Feature icon={Sparkles} title="Natural-language add" desc="“Paid 1800 electricity bill” becomes a categorized transaction instantly." />
          <Feature icon={Mic} title="Voice commands" desc="Tap the mic and speak. The AI transcribes and logs it hands-free." />
          <Feature icon={TrendingUp} title="Knows in vs out" desc="Understands SIP and investments are money leaving — not income." />
          <Feature icon={PieChart} title="Real analytics" desc="Income vs expense trends and category breakdowns, month by month." />
          <Feature icon={Bell} title="Budget alerts" desc="Set a monthly limit and get warned at 50%, 80% and 100%." />
          <Feature icon={Wallet} title="Built for ₹" desc="Indian number formatting and categories, not a dollar app in disguise." />
        </div>
      </section>

      {/* Different */}
      <section className="max-w-3xl mx-auto px-5 pt-20 lg:pt-28">
        <div className="bg-card border border-line rounded-3xl p-6 lg:p-10">
          <h2 className="text-2xl font-semibold mb-5">Why it's different</h2>
          <ul className="space-y-3">
            {[
              "Most trackers make you fill a form for every expense. Here you just talk.",
              "The AI understands intent — investments, refunds, bills — instead of dumb keyword matching.",
              "One clean dashboard: no maze of tabs, everything visible at a glance.",
              "The same AI that reads your text is built to later read bank SMS for auto-capture.",
            ].map((t) => (
              <li key={t} className="flex gap-3 text-sm text-muted">
                <Check size={18} className="text-income shrink-0 mt-0.5" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Builder + footer */}
      <footer className="max-w-3xl mx-auto px-5 py-20 text-center">
        <div className="text-sm text-muted mb-4">Built by</div>
        <div className="text-lg font-medium mb-1">{BUILDER}</div>
        <p className="text-sm text-muted max-w-md mx-auto mb-5">
          Full-stack MERN developer. Paisa is an AI-powered expense tracker with natural-language
          and voice entry, real-time analytics, and budget coaching.
        </p>
        <div className="flex justify-center gap-3">
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm border border-line px-4 py-2 rounded-lg hover:bg-card">
            <Github size={16} /> GitHub
          </a>
          <a href={PORTFOLIO_URL} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm border border-line px-4 py-2 rounded-lg hover:bg-card">
            <ExternalLink size={16} /> Portfolio
          </a>
        </div>
      </footer>
    </div>
  );
}

function Feature({ icon: Icon, title, desc }) {
  return (
    <motion.div {...fade} className="bg-card border border-line rounded-2xl p-5">
      <div className="w-10 h-10 rounded-xl bg-income/10 text-income flex items-center justify-center mb-3">
        <Icon size={20} />
      </div>
      <div className="font-medium mb-1">{title}</div>
      <div className="text-sm text-muted leading-relaxed">{desc}</div>
    </motion.div>
  );
}
