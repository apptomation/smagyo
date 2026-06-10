import { useState } from "react";
import { NavLink, Link, Outlet, Navigate, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Flower2, CalendarDays, Tag,
  ShoppingBag, Users, Ticket, Globe, Settings,
  Building2, CreditCard, BarChart3,
  Menu, X, ChevronRight, Bell, LogOut, Leaf,
} from "lucide-react";
import { useAdminAuth } from "../context/AdminAuthContext";
import { TENANT_ADMIN_NAV, SUPER_ADMIN_NAV } from "../data/adminNav";

const ICON_MAP = {
  LayoutDashboard, Flower2, CalendarDays, Tag,
  ShoppingBag, Users, Ticket, Globe, Settings,
  Building2, CreditCard, BarChart3,
};

const SIDEBAR_W = "w-64";

function NavIcon({ name, size = 17 }) {
  const Icon = ICON_MAP[name];
  return Icon ? <Icon size={size} /> : null;
}

function SidebarNav({ nav, collapsed, onClose }) {
  return (
    <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-6">
      {nav.map((group) => (
        <div key={group.section}>
          {!collapsed && (
            <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
              {group.section}
            </p>
          )}
          <ul className="space-y-0.5">
            {group.items.map((item) => (
              <li key={item.label}>
                <NavLink
                  to={item.href}
                  end={item.href === "/admin"}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  <NavIcon name={item.icon} />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const { user, isSuperAdmin } = useAdminAuth();
  const nav = isSuperAdmin ? SUPER_ADMIN_NAV : TENANT_ADMIN_NAV;

  const sidebarContent = (
    <div className="h-full flex flex-col bg-slate-900">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-white/8 flex-shrink-0">
        <Link to="/" className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center flex-shrink-0">
            <Leaf size={15} color="#fff" strokeWidth={2.5} />
          </span>
          {!collapsed && (
            <span className="font-bold text-white text-lg" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              smag<span className="text-emerald-400">yo</span>
            </span>
          )}
        </Link>
        {/* Collapse toggle — desktop only */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="hidden lg:flex w-6 h-6 rounded-md items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronRight size={14} className={`transition-transform duration-200 ${collapsed ? "" : "rotate-180"}`} />
        </button>
        {/* Close — mobile only */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white"
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      {/* Role badge */}
      {!collapsed && (
        <div className="mx-3 mt-3 px-3 py-2 rounded-xl bg-white/5 border border-white/8">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 mb-0.5">
            {isSuperAdmin ? "Super Admin" : "Store Admin"}
          </p>
          <p className="text-xs text-slate-300 font-medium truncate">{user.tenantName}</p>
        </div>
      )}

      {/* Nav */}
      <SidebarNav nav={nav} collapsed={collapsed} onClose={() => setMobileOpen(false)} />

      {/* User profile */}
      <div className="px-3 pb-4 border-t border-white/8 pt-3 flex-shrink-0">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/8 transition-colors">
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user.avatar}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
            </div>
          )}
          {!collapsed && (
            <LogoutButton />
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col flex-shrink-0 transition-all duration-300 ${
          collapsed ? "w-[68px]" : SIDEBAR_W
        } h-screen sticky top-0`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-[300] transition-all duration-300 ${
          mobileOpen ? "visible" : "invisible pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${mobileOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMobileOpen(false)}
        />
        <aside
          className={`absolute left-0 top-0 h-full ${SIDEBAR_W} transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {sidebarContent}
        </aside>
      </div>
    </>
  );
}

function AdminHeader({ setMobileOpen }) {
  const { user } = useAdminAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-5 sticky top-0 z-10 flex-shrink-0">
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-50"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500" />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-100">
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold">
            {user.avatar}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-slate-700">{user.name}</p>
            <p className="text-[10px] text-slate-400">{user.tenantName}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

function LogoutButton() {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();
  return (
    <button
      onClick={() => { logout(); navigate("/admin/login", { replace: true }); }}
      className="text-slate-400 hover:text-red-400 transition-colors"
      aria-label="Sign out"
    >
      <LogOut size={15} />
    </button>
  );
}

export default function AdminLayout() {
  const { user, isTenantAdmin } = useAdminAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return <Navigate to="/admin/login" replace />;
  if (isTenantAdmin) return <Navigate to="/tenant" replace />;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader setMobileOpen={setMobileOpen} />
        <main className="flex-1 p-5 md:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
