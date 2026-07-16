import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LayoutDashboard, ArrowDownLeft, ArrowUpRight, User, LifeBuoy, LogOut, Plus, Wallet } from "lucide-react";
import { logout } from "../../features/auth/authSlice.js";
import { useAuth } from "../../hooks/useAuth.js";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/income", label: "Income", icon: ArrowDownLeft },
  { to: "/expenses", label: "Expenses", icon: ArrowUpRight },
  { to: "/profile", label: "Profile", icon: User },
];

export default function Sidebar({ onAdd }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useAuth();
  const initials = user?.name ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "U";

  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 h-screen sticky top-0 border-r border-line px-4 py-5">
      <div className="flex items-center gap-2.5 px-2 mb-6">
        <div className="w-9 h-9 rounded-xl bg-income/15 flex items-center justify-center text-income"><Wallet size={19} /></div>
        <span className="text-[17px] font-semibold">Paisa</span>
      </div>

      <div className="flex items-center gap-3 px-2 py-3 mb-4 bg-card rounded-xl">
        <div className="w-9 h-9 rounded-full bg-card2 flex items-center justify-center text-xs">{initials}</div>
        <div className="min-w-0">
          <div className="text-[13px] truncate">{user?.name}</div>
          <div className="text-[11px] text-muted truncate">{user?.email}</div>
        </div>
      </div>

      <button onClick={onAdd}
        className="flex items-center justify-center gap-2 bg-income text-base font-medium py-2.5 rounded-xl mb-5">
        <Plus size={18} /> Add transaction
      </button>

      <nav className="flex flex-col gap-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                isActive ? "bg-card2 text-white" : "text-muted hover:text-white hover:bg-card"
              }`}>
            <Icon size={18} /> {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto border-t border-line pt-3 flex flex-col gap-1">
        <a href="mailto:support@paisa.app"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-muted hover:text-white hover:bg-card">
          <LifeBuoy size={18} /> Support
        </a>
        <button onClick={() => { dispatch(logout()); navigate("/login"); }}
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-muted hover:text-expense">
          <LogOut size={18} /> Log out
        </button>
      </div>
    </aside>
  );
}
