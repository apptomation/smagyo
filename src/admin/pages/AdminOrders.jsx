import { useState } from "react";
import { Search, Eye, Truck, CheckCircle, XCircle, Clock } from "lucide-react";

const STATUSES = ["All", "Processing", "Out for Delivery", "Delivered", "Cancelled"];

const MOCK_ORDERS = [
  { id: "#ORD-1042", customer: "Sarah Mitchell",  email: "sarah@email.com",  product: "Garden Romance Bouquet",    total: 89,  status: "Delivered",       date: "May 30, 2026", city: "New York, NY" },
  { id: "#ORD-1041", customer: "James Torres",    email: "james@email.com",  product: "Lavender Dreams",           total: 58,  status: "Processing",      date: "May 30, 2026", city: "Austin, TX" },
  { id: "#ORD-1040", customer: "Priya Kumar",     email: "priya@email.com",  product: "White Lily Elegance",       total: 95,  status: "Out for Delivery", date: "May 29, 2026", city: "Chicago, IL" },
  { id: "#ORD-1039", customer: "Omar Al-Rashid",  email: "omar@email.com",   product: "Sunrise Dahlia Bunch",      total: 72,  status: "Delivered",       date: "May 29, 2026", city: "Dubai, UAE" },
  { id: "#ORD-1038", customer: "Elena Vasquez",   email: "elena@email.com",  product: "Emerald Forest Arrangement",total: 65,  status: "Cancelled",       date: "May 28, 2026", city: "Miami, FL" },
  { id: "#ORD-1037", customer: "Noah Williams",   email: "noah@email.com",   product: "Sunny Disposition",         total: 48,  status: "Delivered",       date: "May 28, 2026", city: "Seattle, WA" },
  { id: "#ORD-1036", customer: "Aisha Johnson",   email: "aisha@email.com",  product: "Garden Romance Bouquet",    total: 89,  status: "Processing",      date: "May 27, 2026", city: "Atlanta, GA" },
  { id: "#ORD-1035", customer: "Luca Ferrari",    email: "luca@email.com",   product: "White Lily Elegance",       total: 95,  status: "Delivered",       date: "May 27, 2026", city: "Los Angeles, CA" },
];

const STATUS_CONFIG = {
  "Processing":       { color: "bg-blue-100 text-blue-700",    icon: Clock,         dot: "bg-blue-500" },
  "Out for Delivery": { color: "bg-amber-100 text-amber-700",  icon: Truck,         dot: "bg-amber-500" },
  "Delivered":        { color: "bg-emerald-100 text-emerald-700", icon: CheckCircle, dot: "bg-emerald-500" },
  "Cancelled":        { color: "bg-red-100 text-red-700",      icon: XCircle,       dot: "bg-red-400" },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? {};
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
}

export default function AdminOrders() {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = orders.filter((o) => {
    const matchSearch = (
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase())
    );
    const matchStatus = statusFilter === "All" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const updateStatus = (id, newStatus) =>
    setOrders((os) => os.map((o) => (o.id === id ? { ...o, status: newStatus } : o)));

  const totalRevenue = filtered.filter((o) => o.status !== "Cancelled").reduce((s, o) => s + o.total, 0);

  return (
    <div className="space-y-6 max-w-screen-xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Orders</h1>
        <p className="text-sm text-slate-400 mt-0.5">
          {filtered.length} orders · <span className="text-emerald-600 font-semibold">${totalRevenue} revenue</span>
        </p>
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(STATUS_CONFIG).map(([status, cfg]) => {
          const count = orders.filter((o) => o.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(statusFilter === status ? "All" : status)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold transition-all ${
                statusFilter === status ? "border-transparent shadow-sm " + cfg.color : "border-slate-200 text-slate-600 bg-white hover:border-slate-300"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
              {status} <span className="font-bold">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <div className="relative max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID or customer…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                {["Order ID", "Customer", "Product", "City", "Total", "Status", "Date", "Actions"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-400 px-5 py-3.5 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/60 transition-colors group">
                  <td className="px-5 py-4 text-xs font-mono font-bold text-slate-600">{order.id}</td>
                  <td className="px-5 py-4">
                    <p className="text-xs font-semibold text-slate-700">{order.customer}</p>
                    <p className="text-[10px] text-slate-400">{order.email}</p>
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-500 max-w-[160px] truncate">{order.product}</td>
                  <td className="px-5 py-4 text-xs text-slate-500">{order.city}</td>
                  <td className="px-5 py-4 text-sm font-bold text-slate-700">${order.total}</td>
                  <td className="px-5 py-4"><StatusBadge status={order.status} /></td>
                  <td className="px-5 py-4 text-xs text-slate-400 whitespace-nowrap">{order.date}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 text-slate-600 outline-none focus:border-emerald-400"
                      >
                        {STATUSES.filter((s) => s !== "All").map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
