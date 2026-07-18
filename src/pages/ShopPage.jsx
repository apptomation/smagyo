import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Search, Loader2, AlertCircle } from "lucide-react";
import ProductCard from "../components/ui/ProductCard";
import { useTenant } from "../context/TenantContext";
import { listPublicProducts } from "../api/tenantApi";

const CATEGORIES = ["All", "Bouquets", "Arrangements", "Plants", "Gift Sets"];
const OCCASIONS  = ["All", "Birthday", "Wedding", "Anniversary", "Romance", "Sympathy", "New Baby"];

const GRADIENTS = [
  "from-rose-100 to-pink-50",
  "from-emerald-100 to-teal-50",
  "from-amber-100 to-orange-50",
  "from-purple-100 to-violet-50",
  "from-slate-100 to-gray-50",
  "from-blue-100 to-cyan-50",
  "from-teal-100 to-green-50",
  "from-orange-100 to-amber-50",
];

function toDisplayProduct(p) {
  const idx = p.id.codePointAt(p.id.length - 1) % GRADIENTS.length;
  return {
    ...p,
    gradient: GRADIENTS[idx],
    tag: p.stock === 0 ? "Sold Out" : (p.category ?? "Featured"),
    rating: 4.8,
    reviews: 0,
  };
}

const C = {
  charcoal: "#1C1C1C",
  emerald:  "#2D6A4F",
  sage:     "#52796F",
  cream:    "#FAF7F2",
};

/**
 * Generic shop/catalog page.
 * Props:
 *   defaultCategory – pre-selects a category chip  (default: "All")
 *   defaultOccasion – pre-selects an occasion chip  (default: "All")
 *   title           – hero heading override
 */
export default function ShopPage({
  defaultCategory = "All",
  defaultOccasion = "All",
  title,
}) {
  const { slug } = useParams();
  const { tenantId } = useTenant();

  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState(defaultCategory);
  const [occasion, setOccasion] = useState(defaultOccasion);

  // If a URL slug is provided (e.g. /occasions/birthday), sync the filter
  useEffect(() => {
    if (!slug) return;
    const normalized = slug.charAt(0).toUpperCase() + slug.slice(1);
    if (OCCASIONS.includes(normalized)) setOccasion(normalized);
    if (CATEGORIES.includes(normalized)) setCategory(normalized);
  }, [slug]);

  useEffect(() => {
    if (!tenantId) return;
    setLoading(true);
    setError(null);
    listPublicProducts(tenantId)
      .then((data) => setProducts(data.map(toDisplayProduct)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [tenantId]);

  const filtered = products.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat    = category === "All" || p.category === category;
    const matchOcc    = occasion === "All" || p.occasion === occasion;
    return matchSearch && matchCat && matchOcc;
  });

  const heading = title
    ?? (category !== "All" ? category : occasion !== "All" ? `${occasion} Flowers` : "All Products");

  return (
    <div style={{ background: C.cream, minHeight: "70vh" }}>
      {/* ── Page header ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-12 pb-4">
        <h1
          className="text-3xl md:text-4xl font-bold mb-1"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: C.charcoal }}
        >
          {heading}
        </h1>
        <p className="text-sm" style={{ color: C.sage, fontFamily: "'DM Sans', sans-serif" }}>
          {loading
            ? "Loading…"
            : `${filtered.length} product${filtered.length !== 1 ? "s" : ""} available`}
        </p>
      </div>

      {/* ── Filters ──────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-6 flex flex-col gap-3">
        {/* Search */}
        <div className="relative max-w-xs">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition"
          />
        </div>

        {/* Category chips */}
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                category === c
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Occasion chips */}
        <div className="flex gap-2 flex-wrap">
          {OCCASIONS.map((o) => (
            <button
              key={o}
              onClick={() => setOccasion(o)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                occasion === o
                  ? "bg-rose-500 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {o}
            </button>
          ))}
        </div>
      </div>

      {/* ── Product grid ─────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-24">
        {loading ? (
          <div className="flex items-center justify-center gap-3 py-24 text-slate-400">
            <Loader2 size={22} className="animate-spin" />
            <span className="text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Loading products…
            </span>
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-red-50 border border-red-100 text-red-700 text-sm max-w-md">
            <AlertCircle size={16} className="flex-shrink-0" />
            {error}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🌿</div>
            <p
              className="text-base font-medium"
              style={{ color: C.charcoal, fontFamily: "'DM Sans', sans-serif" }}
            >
              No products found
            </p>
            <p
              className="text-sm mt-1"
              style={{ color: C.sage, fontFamily: "'DM Sans', sans-serif" }}
            >
              Try adjusting your filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
