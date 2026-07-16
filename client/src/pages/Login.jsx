import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Wallet } from "lucide-react";
import { loginUser } from "../features/auth/authSlice.js";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, status, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => { if (user) navigate("/dashboard"); }, [user, navigate]);
  useEffect(() => { if (error) toast.error(error); }, [error]);

  const submit = (e) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  return (
    <AuthShell title="Welcome back" subtitle="Log in to your Paisa account">
      <form onSubmit={submit} className="space-y-3">
        <Input type="email" placeholder="you@email.com" value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input type="password" placeholder="Password" value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button disabled={status === "loading"}
          className="w-full bg-income text-base font-medium py-2.5 rounded-xl disabled:opacity-60">
          {status === "loading" ? "Logging in…" : "Log in"}
        </button>
      </form>
      <p className="text-center text-xs text-muted mt-4">
        No account? <Link to="/register" className="text-income">Sign up</Link>
      </p>
    </AuthShell>
  );
}

export function AuthShell({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm">
        <div className="w-11 h-11 rounded-xl bg-income/15 flex items-center justify-center text-income mx-auto mb-4">
          <Wallet size={22} />
        </div>
        <h1 className="text-2xl font-semibold text-center">{title}</h1>
        <p className="text-muted text-center text-sm mb-6">{subtitle}</p>
        <div className="bg-card border border-line rounded-2xl p-5">{children}</div>
      </motion.div>
    </div>
  );
}

export function Input(props) {
  return (
    <input {...props} required
      className="w-full bg-card2 border border-line rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-income/50 placeholder:text-muted" />
  );
}
