import { Link } from "react-router-dom";
import { ArrowRight, Heart, Loader2 } from "lucide-react";
import ProductCard from "../components/ui/ProductCard";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";

const C = {
  charcoal: "#1C1C1C",
  emerald: "#2D6A4F",
  sage: "#52796F",
  cream: "#FAF7F2",
};

function EmptyState({ title, description, ctaLabel, ctaHref, ctaState }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
        style={{ background: "rgba(231,76,60,.08)" }}
      >
        <Heart size={26} style={{ color: "#e74c3c" }} />
      </div>
      <h2
        className="text-xl font-semibold mb-2"
        style={{ color: C.charcoal, fontFamily: "'DM Sans', sans-serif" }}
      >
        {title}
      </h2>
      <p className="text-sm mb-8 max-w-sm" style={{ color: C.sage, fontFamily: "'DM Sans', sans-serif" }}>
        {description}
      </p>
      <Link
        to={ctaHref}
        state={ctaState}
        className="flex items-center gap-2 px-7 py-3.5 rounded-full text-white text-sm font-semibold"
        style={{ background: C.emerald, fontFamily: "'DM Sans', sans-serif" }}
      >
        {ctaLabel} <ArrowRight size={15} />
      </Link>
    </div>
  );
}

export default function WishlistPage() {
  const { isAuthenticated } = useAuth();
  const { items, loading } = useWishlist();

  return (
    <div className="min-h-[70vh]" style={{ background: C.cream }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-14 pb-24">
        <h1
          className="text-3xl md:text-4xl font-bold mb-2"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: C.charcoal }}
        >
          Your Wishlist
        </h1>
        {isAuthenticated && items.length > 0 && (
          <p className="text-sm mb-8" style={{ color: C.sage, fontFamily: "'DM Sans', sans-serif" }}>
            {items.length} saved {items.length === 1 ? "arrangement" : "arrangements"}
          </p>
        )}

        {!isAuthenticated ? (
          <EmptyState
            title="Sign in to see your wishlist"
            description="Save your favourite arrangements and find them again on any device."
            ctaLabel="Sign In"
            ctaHref="/login"
            ctaState={{ from: "/wishlist" }}
          />
        ) : loading && items.length === 0 ? (
          <div className="flex items-center justify-center gap-3 py-24 text-slate-400">
            <Loader2 size={22} className="animate-spin" />
            <span className="text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Loading your wishlist…
            </span>
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            title="Your wishlist is empty"
            description="Tap the heart on any bouquet to save it here."
            ctaLabel="Browse Bouquets"
            ctaHref="/bouquets"
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
