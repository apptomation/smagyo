import { TrendingUp, TrendingDown, ShoppingBag, Users, Flower2, DollarSign, ArrowRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useAdminAuth } from "../../admin/context/AdminAuthContext";

const STATS = [
  {
    label: "Total Revenue",
    value: "$12,480",
    change: "+18%",
    up: true,
    sub: "vs last month",
    icon: DollarSign,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    label: "Orders",
    value: "284",
    change: "+12%",
    up: true,
    sub: "vs last month",
    icon: ShoppingBag,
    color: "bg-blue-50 text-blue-600",
  },
  {
    label: "Active Products",
    value: "47",
    change: "+3",
    up: true,
    sub: "added this month",
    icon: Flower2,
    color: "bg-rose-50 text-rose-600",
  },
  {
    label: "Customers",
    value: "1,203",
    change: "+8%",
    up: true,
    sub: "registered users",
    icon: Users,
    color: "bg-purple-50 text-purple-600",
  },
];

const RECENT_ORDERS = [
  { id: "#ORD-1042", customer: "Sarah Mitchell",  product: "Garden Romance Bouquet",    total: "$89", status: "Delivered",        statusColor: "bg-emerald-100 text-emerald-700" },
  { id: "#ORD-1041", customer: "James Torres",    product: "Lavender Dreams",           total: "$58", status: "Processing",       statusColor: "bg-blue-100 text-blue-700" },
  { id: "#ORD-1040", customer: "Priya Kumar",     product: "White Lily Elegance",       total: "$95", status: "Out for Delivery", statusColor: "bg-amber-100 text-amber-700" },
  { id: "#ORD-1039", customer: "Omar Al-Rashid",  product: "Sunrise Dahlia Bunch",      total: "$72", status: "Delivered",        statusColor: "bg-emerald-100 text-emerald-700" },
  { id: "#ORD-1038", customer: "Elena Vasquez",   product: "Emerald Forest",            total: "$65", status: "Cancelled",        statusColor: "bg-red-100 text-red-700" },
];

const TOP_PRODUCTS = [
  { name: "Garden Romance Bouquet", sold: 88, revenue: "$7,832", emoji: "🌹" },
  { name: "White Lily Elegance",    sold: 56, revenue: "$5,320", emoji: "🌷" },
  { name: "Lavender Dreams",        sold: 74, revenue: "$4,292", emoji: "💐" },
  { name: "Sunrise Dahlia Bunch",   sold: 60, revenue: "$4,320", emoji: "🌸" },
];

function StatCard({ stat }) {
  const { label, value, change, up, sub, icon: Icon, color } = stat;
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-slate-400 mb-1">{label}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        <div className="flex items-center gap-1.5 mt-1">
          {up ? <TrendingUp size={12} className="text-emerald-500" /> : <TrendingDown size={12} className="text-red-400" />}
          <span className={`text-xs font-semibold ${up ? "text-emerald-600" : "text-red-500"}`}>{change}</span>
          <span className="text-xs text-slate-400">{sub}</span>
        </div>
      </div>
    </div>
  );
}

export default function TenantDashboard() {
  const { user } = useAdminAuth();

  return (
    <div className="space-y-8 max-w-screen-xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Welcome back, {user.name.split(" ")[0]} 👋
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">{user.tenantName} · Store Dashboard</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((s) => <StatCard key={s.label} stat={s} />)}
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
            <h2 className="text-sm font-bold text-slate-700">Recent Orders</h2>
            <Link
              to="/tenant/orders"
              className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-50">
                  {["Order", "Customer", "Product", "Total", "Status"].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-400 px-6 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RECENT_ORDERS.map((order) => (
                  <tr key={order.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3.5 text-xs font-mono font-medium text-slate-500">{order.id}</td>
                    <td className="px-6 py-3.5 text-xs font-medium text-slate-700">{order.customer}</td>
                    <td className="px-6 py-3.5 text-xs text-slate-500">{order.product}</td>
                    <td className="px-6 py-3.5 text-xs font-bold text-slate-700">{order.total}</td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex text-[10px] font-semibold px-2.5 py-1 rounded-full ${order.statusColor}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top products */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
            <h2 className="text-sm font-bold text-slate-700">Top Products</h2>
            <Link
              to="/tenant/products"
              className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <ul className="divide-y divide-slate-50">
            {TOP_PRODUCTS.map((p) => (
              <li key={p.name} className="flex items-center gap-3 px-6 py-3.5">
                <span className="text-xl w-8 text-center">{p.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-700 truncate">{p.name}</p>
                  <p className="text-[10px] text-slate-400">{p.sold} sold</p>
                </div>
                <span className="text-xs font-bold text-emerald-600">{p.revenue}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
