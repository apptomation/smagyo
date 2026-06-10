import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Edit2, Trash2, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { useAdminAuth } from "../../admin/context/AdminAuthContext";
import * as productApi from "../../api/productApi";

const CATEGORIES = ["All", "Bouquets", "Arrangements", "Plants", "Gift Sets"];
const OCCASIONS  = ["All", "Birthday", "Wedding", "Anniversary", "Romance", "Sympathy", "New Baby"];

function ProductModal({ product, onClose, onSave, saving }) {
  const [form, setForm] = useState(
    product
      ? { ...product, price: String(product.price), stock: String(product.stock) }
      : { name: "", description: "", category: "Bouquets", occasion: "Birthday", price: "", stock: "", active: true, emoji: "💐" }
  );
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400">✕</button>
        </div>

        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Emoji picker */}
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Emoji / Icon</label>
            <div className="flex gap-2 flex-wrap">
              {["🌹", "🌷", "🌸", "💐", "🌻", "🌺", "🌿", "🪴"].map((e) => (
                <button
                  key={e}
                  onClick={() => set("emoji", e)}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border-2 transition-all ${
                    form.emoji === e ? "border-emerald-500 bg-emerald-50" : "border-transparent hover:border-slate-200"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Product Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Garden Romance Bouquet"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Description</label>
            <textarea
              value={form.description ?? ""}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Short description shown on the product page…"
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Category *</label>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 outline-none focus:border-emerald-400"
              >
                {CATEGORIES.filter((c) => c !== "All").map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Occasion *</label>
              <select
                value={form.occasion}
                onChange={(e) => set("occasion", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 outline-none focus:border-emerald-400"
              >
                {OCCASIONS.filter((o) => o !== "All").map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Price ($) *</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Stock Qty</label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => set("stock", e.target.value)}
                placeholder="0"
                min="0"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition"
              />
            </div>
          </div>

          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-medium text-slate-700">Visible on storefront</p>
              <p className="text-xs text-slate-400">Customers can see and purchase this product</p>
            </div>
            <button
              onClick={() => set("active", !form.active)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${form.active ? "bg-emerald-500" : "bg-slate-200"}`}
              role="switch"
              aria-checked={form.active}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${form.active ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end">
          <button onClick={onClose} disabled={saving} className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50">Cancel</button>
          <button
            onClick={() => onSave(form)}
            disabled={saving || !form.name || !form.price || !form.stock}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            {product ? "Save Changes" : "Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TenantProducts() {
  const { user } = useAdminAuth();
  const token = user?.token;

  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [search,   setSearch]   = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [modal, setModal] = useState(null); // null | "new" | product object
  const [saving, setSaving] = useState(false);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const page = await productApi.listProducts(token);
      setProducts(page.content);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // ── Derived list ──────────────────────────────────────────────────────────
  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat    = catFilter === "All" || p.category === catFilter;
    return matchSearch && matchCat;
  });

  // ── Mutations ─────────────────────────────────────────────────────────────
  const toggleActive = async (p) => {
    try {
      const updated = await productApi.updateProduct(token, p.id, {
        name: p.name, description: p.description ?? "",
        price: p.price, originalPrice: p.originalPrice ?? null,
        stock: p.stock, active: !p.active,
        category: p.category, occasion: p.occasion,
        emoji: p.emoji, imageUrl: p.imageUrl ?? null,
      });
      setProducts((ps) => ps.map((x) => (x.id === p.id ? updated : x)));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await productApi.deleteProduct(token, id);
      setProducts((ps) => ps.filter((p) => p.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const saveProduct = async (form) => {
    setSaving(true);
    const payload = {
      name:          form.name,
      description:   form.description ?? "",
      price:         Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      stock:         Number(form.stock),
      active:        form.active,
      category:      form.category,
      occasion:      form.occasion,
      emoji:         form.emoji,
      imageUrl:      form.imageUrl ?? null,
    };
    try {
      if (modal === "new") {
        const created = await productApi.createProduct(token, payload);
        setProducts((ps) => [created, ...ps]);
      } else {
        const updated = await productApi.updateProduct(token, modal.id, payload);
        setProducts((ps) => ps.map((p) => (p.id === modal.id ? updated : p)));
      }
      setModal(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Products</h1>
          <p className="text-sm text-slate-400 mt-0.5">{products.length} products in your catalog</p>
        </div>
        <button
          onClick={() => setModal("new")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-red-50 border border-red-100 text-red-700 text-sm">
          <AlertCircle size={16} className="flex-shrink-0" />
          {error}
          <button onClick={() => setError("")} className="ml-auto text-red-400 hover:text-red-600 text-lg leading-none">×</button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCatFilter(c)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                catFilter === c ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center gap-3 py-20 text-slate-400">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-sm">Loading products…</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  {["Product", "Category", "Occasion", "Price", "Stock", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-400 px-5 py-3.5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-xl flex-shrink-0">
                          {p.emoji ?? "💐"}
                        </div>
                        <span className="text-sm font-semibold text-slate-700">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500">{p.category ?? "—"}</td>
                    <td className="px-5 py-4 text-xs text-slate-500">{p.occasion ?? "—"}</td>
                    <td className="px-5 py-4 text-sm font-bold text-slate-700">${Number(p.price).toFixed(2)}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold ${p.stock === 0 ? "text-red-500" : p.stock <= 5 ? "text-amber-500" : "text-slate-600"}`}>
                        {p.stock === 0 ? "Out of stock" : `${p.stock} left`}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex text-[10px] font-semibold px-2.5 py-1 rounded-full ${p.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                        {p.active ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setModal(p)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors" aria-label="Edit"><Edit2 size={14} /></button>
                        <button onClick={() => toggleActive(p)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-amber-50 hover:text-amber-600 transition-colors" aria-label={p.active ? "Hide" : "Show"}>{p.active ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                        <button onClick={() => handleDelete(p.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors" aria-label="Delete"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && !loading && (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-400 text-sm">
                      No products found.{" "}
                      <button onClick={() => setModal("new")} className="text-emerald-600 font-medium hover:underline">Add your first product</button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal !== null && (
        <ProductModal product={modal === "new" ? null : modal} onClose={() => setModal(null)} onSave={saveProduct} saving={saving} />
      )}
    </div>
  );
}
