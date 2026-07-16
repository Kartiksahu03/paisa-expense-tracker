import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { registerUser } from "../features/auth/authSlice.js";
import { AuthShell, Input } from "./Login.jsx";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, status, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  useEffect(() => { if (user) navigate("/dashboard"); }, [user, navigate]);
  useEffect(() => { if (error) toast.error(error); }, [error]);

  const submit = (e) => {
    e.preventDefault();
    dispatch(registerUser(form));
  };

  return (
    <AuthShell title="Create account" subtitle="Start tracking with Paisa">
      <form onSubmit={submit} className="space-y-3">
        <Input type="text" placeholder="Your name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input type="email" placeholder="you@email.com" value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input type="password" placeholder="Password (min 6 chars)" value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button disabled={status === "loading"}
          className="w-full bg-income text-base font-medium py-2.5 rounded-xl disabled:opacity-60">
          {status === "loading" ? "Creating…" : "Sign up"}
        </button>
      </form>
      <p className="text-center text-xs text-muted mt-4">
        Have an account? <Link to="/login" className="text-income">Log in</Link>
      </p>
    </AuthShell>
  );
}
