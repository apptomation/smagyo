import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Truck,
  Leaf,
  Clock,
  ShieldCheck,
  Star,
  Quote,
  CalendarDays,
  Loader2,
} from "lucide-react";
import ProductCard from "../components/ui/ProductCard";
import { FEATURED_PRODUCTS, OCCASIONS, TESTIMONIALS, BLOG_POSTS } from "../data/products";
import { useTenant } from "../context/TenantContext";
import { listPublicProducts } from "../api/tenantApi";

const C = {
  charcoal: "#1C1C1C",
  emerald: "#2D6A4F",
  sage: "#52796F",
  mint: "#84A98C",
  cream: "#FAF7F2",
  rose: "#F4A5A5",
};

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

/** Adapts a backend ProductDto to the shape ProductCard expects. */
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

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ products }) {
  const heroProducts = (products.length > 0 ? products : FEATURED_PRODUCTS).slice(0, 4);

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${C.cream} 0%, #EEF4EE 55%, #FBF0F0 100%)`,
      }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute -top-40 -right-40 w-[560px] h-[560px] rounded-full opacity-20 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${C.mint}, transparent 70%)` }}
      />
      <div
        className="absolute -bottom-28 -left-28 w-[420px] h-[420px] rounded-full opacity-15 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${C.rose}, transparent 70%)` }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-16 grid md:grid-cols-2 gap-14 items-center">
        {/* Copy */}
        <div>
          <span
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] px-4 py-1.5 rounded-full mb-6"
            style={{
              background: "rgba(45,106,79,.1)",
              color: C.emerald,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <Leaf size={11} /> Seasonal Collection · Summer 2026
          </span>

          <h1
            className="text-5xl md:text-6xl lg:text-[4.5rem] font-bold leading-[1.07] mb-6"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: C.charcoal }}
          >
            Where Nature
            <br />
            <span style={{ color: C.emerald }}>Speaks</span> in
            <br />
            Petals
          </h1>

          <p
            className="text-base md:text-lg leading-relaxed max-w-md mb-8"
            style={{ color: C.sage, fontFamily: "'DM Sans', sans-serif" }}
          >
            Thoughtfully arranged, sustainably sourced floral creations for every
            meaningful moment — from intimate gestures to grand celebrations.
          </p>

          <div className="flex flex-wrap gap-3 mb-10">
            <Link
              to="/bouquets"
              className="flex items-center gap-2 px-7 py-3.5 rounded-full text-white text-sm font-semibold transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
              style={{
                background: C.emerald,
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: `0 8px 24px rgba(45,106,79,.35)`,
              }}
            >
              Shop Now <ArrowRight size={15} />
            </Link>
            <Link
              to="/occasions"
              className="flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-[1.03] border"
              style={{
                borderColor: C.charcoal,
                color: C.charcoal,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Browse Occasions
            </Link>
          </div>

          {/* Trust micro-stats */}
          <div className="flex flex-wrap gap-6">
            {[
              { value: "5,000+", label: "Happy Customers" },
              { value: "Same-Day", label: "Delivery Available" },
              { value: "100%", label: "Sustainable Sourcing" },
            ].map(({ value, label }) => (
              <div key={label}>
                <p
                  className="text-lg font-bold"
                  style={{ color: C.charcoal, fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {value}
                </p>
                <p
                  className="text-xs"
                  style={{ color: C.sage, fontFamily: "'DM Sans', sans-serif" }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Hero product grid */}
        <div className="grid grid-cols-2 gap-4">
          {heroProducts.map((p, i) => (
            <div
              key={p.id}
              className={`relative rounded-3xl overflow-hidden cursor-pointer group transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl ${
                i === 0 ? "row-span-2" : ""
              }`}
              style={{ minHeight: i === 0 ? 340 : 155 }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${p.gradient}`}
              />
              <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-45 group-hover:scale-110 transition-transform duration-400 select-none">
                {p.emoji}
              </div>

              <span
                className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                style={{
                  background: "rgba(255,255,255,.86)",
                  color: C.emerald,
                  backdropFilter: "blur(8px)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {p.tag}
              </span>

              <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-white/80 to-transparent backdrop-blur-[2px]">
                <p
                  className="text-xs font-semibold leading-tight mb-0.5"
                  style={{ color: C.charcoal, fontFamily: "'DM Sans', sans-serif" }}
                >
                  {p.name}
                </p>
                <p
                  className="text-xs font-bold"
                  style={{ color: C.emerald, fontFamily: "'DM Sans', sans-serif" }}
                >
                  ${p.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Features strip ───────────────────────────────────────────────────────────
function FeaturesStrip() {
  const features = [
    { Icon: Clock, title: "Same-Day Delivery", desc: "Order before 2PM for same-day delivery" },
    { Icon: Leaf, title: "Sustainably Sourced", desc: "Ethically grown from certified farms" },
    { Icon: ShieldCheck, title: "Freshness Guarantee", desc: "Full refund if not satisfied" },
    { Icon: Truck, title: "Free Shipping", desc: "On all orders over $60" },
  ];

  return (
    <section className="bg-white border-y" style={{ borderColor: "rgba(45,106,79,.1)" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map(({ Icon, title, desc }) => (
          <div key={title} className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: "rgba(45,106,79,.08)" }}
            >
              <Icon size={19} style={{ color: C.emerald }} />
            </div>
            <div>
              <p
                className="text-sm font-semibold"
                style={{ color: C.charcoal, fontFamily: "'DM Sans', sans-serif" }}
              >
                {title}
              </p>
              <p
                className="text-xs leading-snug mt-0.5"
                style={{ color: C.sage, fontFamily: "'DM Sans', sans-serif" }}
              >
                {desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Shop by Occasion ─────────────────────────────────────────────────────────
function OccasionsSection() {
  return (
    <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <span
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] px-3 py-1 rounded-full mb-3"
          style={{ background: "rgba(45,106,79,.08)", color: C.emerald, fontFamily: "'DM Sans', sans-serif" }}
        >
          <CalendarDays size={11} /> Curated For Every Moment
        </span>
        <h2
          className="text-3xl md:text-4xl font-bold"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: C.charcoal }}
        >
          Shop by Occasion
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {OCCASIONS.map((occ) => (
          <Link
            key={occ.label}
            to={occ.href}
            className="flex flex-col items-center gap-3 py-7 rounded-2xl transition-all duration-200 hover:scale-[1.04] hover:shadow-md group"
            style={{
              background: "#fff",
              border: "1.5px solid rgba(45,106,79,.09)",
            }}
          >
            <span
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl bg-gradient-to-br ${occ.color} transition-transform duration-200 group-hover:scale-110`}
            >
              {occ.emoji}
            </span>
            <span
              className="text-xs font-semibold"
              style={{ color: C.charcoal, fontFamily: "'DM Sans', sans-serif" }}
            >
              {occ.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ─── Featured Products ────────────────────────────────────────────────────────
function FeaturedProducts({ products, loading, error }) {
  const displayList = products.length > 0 ? products : FEATURED_PRODUCTS;

  return (
    <section
      className="py-20 px-6 md:px-12"
      style={{ background: C.cream }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] px-3 py-1 rounded-full mb-3"
              style={{ background: "rgba(45,106,79,.08)", color: C.emerald, fontFamily: "'DM Sans', sans-serif" }}
            >
              <Star size={11} fill={C.emerald} strokeWidth={0} /> Most Loved
            </span>
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: C.charcoal }}
            >
              Featured Arrangements
            </h2>
          </div>
          <Link
            to="/bouquets"
            className="hidden md:flex items-center gap-1.5 text-sm font-medium hover:gap-2.5 transition-all"
            style={{ color: C.emerald, fontFamily: "'DM Sans', sans-serif" }}
          >
            View All <ArrowRight size={15} />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 py-20">
            <Loader2 size={20} className="animate-spin" style={{ color: C.sage }} />
            <span className="text-sm" style={{ color: C.sage, fontFamily: "'DM Sans', sans-serif" }}>Loading products…</span>
          </div>
        ) : error ? (
          <p className="text-center py-12 text-sm" style={{ color: "#e74c3c", fontFamily: "'DM Sans', sans-serif" }}>
            {error}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayList.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link
            to="/bouquets"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium border transition-colors hover:bg-emerald-50"
            style={{
              borderColor: C.emerald,
              color: C.emerald,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            View All Arrangements <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Promo Banner ─────────────────────────────────────────────────────────────
function PromoBanner() {
  return (
    <section
      className="py-20 px-6 md:px-12"
      style={{
        background: `linear-gradient(135deg, ${C.emerald} 0%, #1a4d38 100%)`,
      }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <p
          className="text-xs font-bold uppercase tracking-[0.2em] mb-3 opacity-70 text-white"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Limited Time
        </p>
        <h2
          className="text-3xl md:text-5xl font-bold text-white mb-4"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Summer Sale — Up to 30% Off
        </h2>
        <p
          className="text-base text-white/70 mb-8 max-w-md mx-auto"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Explore our hand-picked summer collection. Fresh blooms at their seasonal best.
        </p>
        <Link
          to="/bouquets"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm transition-all duration-200 hover:scale-[1.03]"
          style={{
            background: "#fff",
            color: C.emerald,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Shop the Sale <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  );
}

// ─── Why Choose Us ────────────────────────────────────────────────────────────
function WhyChooseUs() {
  const points = [
    {
      emoji: "🌱",
      title: "Sustainably Grown",
      desc: "Every stem is sourced from farms committed to eco-friendly, ethical practices.",
    },
    {
      emoji: "✂️",
      title: "Expert Artistry",
      desc: "Our florists have over a decade of experience crafting bespoke arrangements.",
    },
    {
      emoji: "📦",
      title: "Elegant Packaging",
      desc: "Gift-ready packaging using recycled and biodegradable materials.",
    },
    {
      emoji: "⚡",
      title: "Fast Fulfillment",
      desc: "From farm to doorstep — same day delivery available across select areas.",
    },
  ];

  return (
    <section className="py-20 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2
            className="text-3xl md:text-4xl font-bold"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: C.charcoal }}
          >
            Why Smayo?
          </h2>
          <p
            className="mt-3 text-base max-w-lg mx-auto"
            style={{ color: C.sage, fontFamily: "'DM Sans', sans-serif" }}
          >
            We believe beautiful flowers should be accessible, sustainable, and delivered with care.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {points.map(({ emoji, title, desc }) => (
            <div key={title} className="text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
                style={{ background: "rgba(45,106,79,.07)" }}
              >
                {emoji}
              </div>
              <h3
                className="text-base font-semibold mb-2"
                style={{ color: C.charcoal, fontFamily: "'DM Sans', sans-serif" }}
              >
                {title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: C.sage, fontFamily: "'DM Sans', sans-serif" }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function Testimonials() {
  return (
    <section
      className="py-20 px-6 md:px-12"
      style={{ background: C.cream }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: C.charcoal }}
          >
            What Our Customers Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="rounded-3xl p-7 flex flex-col gap-4"
              style={{
                background: "#fff",
                border: "1px solid rgba(45,106,79,.08)",
                boxShadow: "0 4px 20px rgba(0,0,0,.04)",
              }}
            >
              <Quote size={22} style={{ color: C.mint }} />
              <p
                className="text-sm leading-relaxed flex-1"
                style={{ color: C.sage, fontFamily: "'DM Sans', sans-serif" }}
              >
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${t.avatarColor}`}
                >
                  {t.avatar}
                </div>
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: C.charcoal, fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {t.name}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: C.sage, fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {t.location}
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={12} fill={C.emerald} strokeWidth={0} style={{ color: C.emerald }} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Blog teaser ──────────────────────────────────────────────────────────────
function BlogTeaser() {
  return (
    <section className="py-20 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: C.charcoal }}
          >
            From the Garden Journal
          </h2>
          <Link
            to="/blog"
            className="hidden md:flex items-center gap-1.5 text-sm font-medium hover:gap-2.5 transition-all"
            style={{ color: C.emerald, fontFamily: "'DM Sans', sans-serif" }}
          >
            Visit the Blog <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BLOG_POSTS.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.id}`}
              className="group rounded-3xl overflow-hidden border transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
              style={{
                background: "#fff",
                border: "1px solid rgba(45,106,79,.08)",
              }}
            >
              <div
                className="h-44 flex items-center justify-center text-6xl"
                style={{ background: C.cream }}
              >
                {post.emoji}
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full"
                    style={{ background: "rgba(45,106,79,.08)", color: C.emerald, fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {post.category}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: C.sage, fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {post.readTime}
                  </span>
                </div>
                <h3
                  className="text-base font-semibold mb-2 leading-snug group-hover:text-emerald-700 transition-colors"
                  style={{ color: C.charcoal, fontFamily: "'DM Sans', sans-serif" }}
                >
                  {post.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: C.sage, fontFamily: "'DM Sans', sans-serif" }}
                >
                  {post.excerpt}
                </p>
                <p
                  className="text-xs mt-3"
                  style={{ color: "rgba(82,121,111,.6)", fontFamily: "'DM Sans', sans-serif" }}
                >
                  {post.date}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Newsletter CTA ───────────────────────────────────────────────────────────
function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section
      className="py-20 px-6 md:px-12"
      style={{
        background: `linear-gradient(135deg, #FBF0F0 0%, ${C.cream} 50%, #EEF4EE 100%)`,
      }}
    >
      <div className="max-w-2xl mx-auto text-center">
        <div className="text-4xl mb-5">🌸</div>
        <h2
          className="text-3xl md:text-4xl font-bold mb-4"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: C.charcoal }}
        >
          Join the Bloom Circle
        </h2>
        <p
          className="text-base mb-8 leading-relaxed"
          style={{ color: C.sage, fontFamily: "'DM Sans', sans-serif" }}
        >
          Get seasonal inspiration, exclusive offers, and expert flower care tips
          delivered fresh to your inbox every week.
        </p>

        {submitted ? (
          <div
            className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl text-sm font-medium"
            style={{ background: "rgba(45,106,79,.1)", color: C.emerald, fontFamily: "'DM Sans', sans-serif" }}
          >
            🌿 You're in! Watch your inbox for something beautiful.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-5 py-3.5 rounded-full outline-none text-sm border"
              style={{
                borderColor: "rgba(45,106,79,.2)",
                color: C.charcoal,
                background: "rgba(255,255,255,.9)",
                fontFamily: "'DM Sans', sans-serif",
              }}
              required
            />
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold text-white transition-all hover:scale-[1.02]"
              style={{ background: C.emerald, fontFamily: "'DM Sans', sans-serif" }}
            >
              Subscribe <ArrowRight size={14} />
            </button>
          </form>
        )}

        <p
          className="mt-4 text-xs"
          style={{ color: "rgba(82,121,111,.6)", fontFamily: "'DM Sans', sans-serif" }}
        >
          No spam, ever. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}

// ─── HomePage ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { tenantId } = useTenant();
  const [products, setProducts]               = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError,   setProductsError]   = useState(null);

  useEffect(() => {
    if (!tenantId) return;
    setProductsLoading(true);
    setProductsError(null);
    listPublicProducts(tenantId)
      .then((data) => setProducts(data.map(toDisplayProduct)))
      .catch((err) => setProductsError(err.message))
      .finally(() => setProductsLoading(false));
  }, [tenantId]);

  return (
    <>
      <Hero products={products} />
      <FeaturesStrip />
      <OccasionsSection />
      <FeaturedProducts products={products} loading={productsLoading} error={productsError} />
      <PromoBanner />
      <WhyChooseUs />
      <Testimonials />
      <BlogTeaser />
      <NewsletterCTA />
    </>
  );
}
