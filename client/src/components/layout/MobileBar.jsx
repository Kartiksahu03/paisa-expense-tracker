import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Wallet, Plus, LayoutDashboard, ArrowDownLeft, ArrowUpRight, User, LogOut } from "lucide-react";
import { logout } from "../../features/auth/authSlice.js";

const tabs = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/income", label: "Income", icon: ArrowDownLeft },
  { to: "/expenses", label: "Expenses", icon: ArrowUpRight },
  { to: "/profile", label: "Profile", icon: User },
];

export default function MobileBar({ onAdd }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <>
      <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-line sticky top-0 bg-base z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-income/15 flex items-center justify-center text-income"><Wallet size={17} /></div>
          <span className="text-[15px] font-semibold">Paisa</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onAdd} className="w-8 h-8 rounded-lg bg-income flex items-center justify-center"><Plus size={18} /></button>
          <button onClick={() => { dispatch(logout()); navigate("/login"); }} className="text-muted"><LogOut size={18} /></button>
        </div>
      </header>

      <nav className="lg:hidden fixed bottom-0 inset-x-0 border-t border-line bg-base flex z-20">
        {tabs.map(({ to, label, icon: Icon }) => (
          <button key={to} onClick={() => navigate(to)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 ${pathname === to ? "text-income" : "text-muted"}`}>
            <Icon size={19} /><span className="text-[10px]">{label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
