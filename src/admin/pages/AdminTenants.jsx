import { useState } from "react";
import { Plus, Search, Edit2, Globe, MoreVertical, TrendingUp, ShoppingBag, Users } from "lucide-react";

// Each row = one flower company (tenant) — this is the core SAAS view
const MOCK_TENANTS = [
  {
    id: "t-001",
    name: "Rose Garden Shop",
    domain: "rosegarden.smagyo.com",
    owner: "Alice Johnson",
    email: "alice@rosegarden.com",
    plan: "Pro",
    status: "Active",
    products: 48,
    orders: 312,
    revenue: "$18,240",
    joined: "Jan 12, 2025",
    logo: "🌹",
  },
  {
    id: "t-002",
    name: "City Blooms",
    domain: "cityblooms.smagyo.com",
    owner: "Mohammed Al-Farsi",
    email: "mo@cityblooms.com",
    plan: "Starter",
    status: "Active",
    products: 23,
    orders: 189,
    revenue: "$9,450",
    joined: "Feb 5, 2025",
    logo: "💐",
  },
  {
    id: "t-003",
    name: "Green Petal Co.",
    domain: "greenpetal.smagyo.com",
    owner: "Sofia Laurent",
    email: "sofia@greenpetal.com",
    plan: "Pro",
    status: "Active",
    products: 67,
    orders: 540,
    revenue: "$29,800",
    joined: "Dec 3, 2024",
    logo: "🌿",
  },
  {
    id: "t-004",
    name: "Bloom & Gather",
    domain: "bloomgather.smagyo.com",
    owner: "Tariq Mansour",
    email: "tariq@bloomgather.com",
    plan: "Enterprise",
    status: "Active",
    products: 134,
    orders: 1240,
    revenue: "$74,600",
    joined: "Oct 20, 2024",
    logo: "🌺",
  },
  {
    id: "t-005",
    name: "The Lily Barn",
    domain: "lilybarn.smagyo.com",
    owner: "Hannah Schmidt",
    email: "hannah@lilybarn.com",
    plan: "Starter",
    status: "Trial",
    products: 11,
    orders: 28,
    revenue: "$1,320",
    joined: "May 20, 2026",
    logo: "🌷",
  },
  {
    id: "t-006",
    name: "SunPetal Studio",
    domain: "sunpetal.smagyo.com",
    owner: "Carlos Rivera",
    email: "carlos@sunpetal.com",
    plan: "Pro",
    status: "Suspended",
    products: 29,
    orders: 0,
    revenue: "$0",
    joined: "Mar 18, 2025",
    logo: "🌻",
  },
];

const PLAN_COLORS = {
  Starter:    "bg-slate-100 text-slate-600",
  Pro:        "bg-blue-100 text-blue-700",
  Enterprise: "bg-purple-100 text-purple-700",
};

const STATUS_COLORS = {
  Active:    "bg-emerald-100 text-emerald-700",
  Trial:     "bg-amber-100 text-amber-700",
  Suspended: "bg-red-100 text-red-700",
};

export default function AdminTenants() {
  const [tenants] = useState(MOCK_TENANTS);
  const [search, setSearch] = useState("");

  const filtered = tenants.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.owner.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = tenants.reduce((s, t) => s + parseFloat(t.revenue.replace(/[$,]/g, "")), 0);

  return (
    <div className="space-y-6 max-w-screen-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Tenants</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {tenants.length} flower companies · Platform revenue:{" "}
            <span className="text-emerald-600 font-semibold">${totalRevenue.toLocaleString()}</span>
          </p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm">
          <Plus size={16} /> Invite Tenant
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Tenants",    value: tenants.filter((t) => t.status === "Active").length,  icon: Users,       color: "text-emerald-600 bg-emerald-50" },
          { label: "Trial Tenants",     value: tenants.filter((t) => t.status === "Trial").length,   icon: TrendingUp,  color: "text-amber-600 bg-amber-50" },
          { label: "Total Products",    value: tenants.reduce((s, t) => s + t.products, 0),          icon: Globe,       color: "text-blue-600 bg-blue-50" },
          { label: "Total Orders",      value: tenants.reduce((s, t) => s + t.orders, 0),            icon: ShoppingBag, color: "text-purple-600 bg-purple-50" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
              <Icon size={18} />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800">{value}</p>
              <p className="text-xs text-slate-400">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <div className="relative max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by company or owner…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition"
          />
        </div>
      </div>

      {/* Tenants table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                {["Company", "Owner", "Domain", "Plan", "Products", "Orders", "Revenue", "Status", "Joined", ""].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-400 px-5 py-3.5 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/60 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xl w-8 text-center">{t.logo}</span>
                      <span className="text-sm font-semibold text-slate-700">{t.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-xs font-medium text-slate-700">{t.owner}</p>
                    <p className="text-[10px] text-slate-400">{t.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <a
                      href={`https://${t.domain}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
                    >
                      <Globe size={11} /> {t.domain}
                    </a>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${PLAN_COLORS[t.plan]}`}>
                      {t.plan}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs font-semibold text-slate-600">{t.products}</td>
                  <td className="px-5 py-4 text-xs font-semibold text-slate-600">{t.orders}</td>
                  <td className="px-5 py-4 text-sm font-bold text-emerald-700">{t.revenue}</td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[t.status]}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-400 whitespace-nowrap">{t.joined}</td>
                  <td className="px-5 py-4">
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors opacity-0 group-hover:opacity-100">
                      <MoreVertical size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Architecture explanation */}
      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <h3 className="text-sm font-bold text-blue-800 mb-2">How multi-tenancy works in your backend</h3>
        <div className="grid sm:grid-cols-3 gap-4 text-xs text-blue-700">
          <div className="bg-white rounded-xl p-4 border border-blue-100">
            <p className="font-bold mb-1">1. Registration</p>
            <p className="text-blue-600">When a flower company signs up, Spring Boot creates a <code className="bg-blue-50 px-1 rounded">Tenant</code> record with a unique UUID. All their data is tagged with this UUID.</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-blue-100">
            <p className="font-bold mb-1">2. Authentication</p>
            <p className="text-blue-600">The JWT token contains <code className="bg-blue-50 px-1 rounded">tenant_id</code>. A Spring Security filter reads it and stores it in thread context — every DB query automatically scopes to that tenant.</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-blue-100">
            <p className="font-bold mb-1">3. Data Isolation</p>
            <p className="text-blue-600">A JPA <code className="bg-blue-50 px-1 rounded">@Filter</code> or repository base class appends <code className="bg-blue-50 px-1 rounded">WHERE tenant_id = ?</code> to every query automatically — no manual filtering needed.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
