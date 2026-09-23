import { useLocation, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";

const C = {
  charcoal: "#1C1C1C",
  emerald: "#2D6A4F",
  sage: "#52796F",
};

export default function ProductCard({ product, size = "default" }) {
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const { isWishlisted, toggle } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  // Static fallback products (numeric ids) don't exist in the backend
  const canWishlist = typeof product.id === "string";
  const liked = canWishlist && isWishlisted(product.id);

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate("/login", {
        state: { from: location.pathname, notice: "Sign in to save items to your wishlist." },
      });
      return;
    }
    toggle(product);
  };

  return (
    <div
      className={`group relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
        size === "large" ? "row-span-2" : ""
      }`}
      style={{
        background: "#fff",
        border: "1px solid rgba(45,106,79,.08)",
        boxShadow: "0 2px 16px rgba(0,0,0,.04)",
      }}
    >
      {/* Image / emoji */}
      <div
        className={`relative overflow-hidden bg-gradient-to-br ${product.gradient} ${
          size === "large" ? "h-64" : "h-48"
        }`}
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-50 group-hover:scale-110 transition-transform duration-500 select-none">
            {product.emoji}
          </div>
        )}

        {/* Tag badge */}
        <span
          className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
          style={{
            background: "rgba(255,255,255,.88)",
            color: C.emerald,
            backdropFilter: "blur(8px)",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {product.tag}
        </span>

        {/* Wishlist button — always visible once liked */}
        {canWishlist && (
          <button
            type="button"
            onClick={handleWishlist}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 focus-visible:opacity-100 ${
              liked ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
            style={{ background: "rgba(255,255,255,.88)", backdropFilter: "blur(8px)" }}
            aria-label={liked ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
            aria-pressed={liked}
          >
            <Heart size={14} fill={liked ? "#e74c3c" : "none"} style={{ color: "#e74c3c" }} />
          </button>
        )}
      </div>

      {/* Card body */}
      <div className="p-4">
        <p
          className="text-xs font-medium mb-1"
          style={{ color: C.sage, fontFamily: "'DM Sans', sans-serif" }}
        >
          {product.occasion}
        </p>
        <h3
          className="text-sm font-semibold mb-2 leading-snug"
          style={{ color: C.charcoal, fontFamily: "'DM Sans', sans-serif" }}
        >
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={11}
              fill={i < Math.round(product.rating) ? C.emerald : "none"}
              strokeWidth={1.5}
              style={{ color: C.emerald }}
            />
          ))}
          <span
            className="text-[11px] ml-0.5"
            style={{ color: C.sage, fontFamily: "'DM Sans', sans-serif" }}
          >
            ({product.reviews})
          </span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span
              className="text-base font-bold"
              style={{ color: C.charcoal, fontFamily: "'DM Sans', sans-serif" }}
            >
              ${product.price}
            </span>
            {product.originalPrice && (
              <span
                className="text-xs line-through"
                style={{ color: "rgba(28,28,28,.35)", fontFamily: "'DM Sans', sans-serif" }}
              >
                ${product.originalPrice}
              </span>
            )}
          </div>
          <button
            onClick={() => addItem(product)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white transition-all duration-150 hover:scale-105 active:scale-95"
            style={{ background: C.emerald, fontFamily: "'DM Sans', sans-serif" }}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart size={12} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
