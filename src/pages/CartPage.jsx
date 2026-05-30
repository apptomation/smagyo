import { Link } from "react-router-dom";
import { ShoppingCart, Trash2, ArrowRight, Leaf } from "lucide-react";
import { useCart } from "../context/CartContext";

const C = {
  charcoal: "#1C1C1C",
  emerald: "#2D6A4F",
  sage: "#52796F",
  cream: "#FAF7F2",
};

export default function CartPage() {
  const { items, removeItem, updateQty, totalItems, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div
        className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-20 text-center"
        style={{ background: C.cream }}
      >
        <div className="text-6xl mb-6">🛒</div>
        <h1
          className="text-3xl font-bold mb-3"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: C.charcoal }}
        >
          Your cart is empty
        </h1>
        <p
          className="text-base mb-8 max-w-sm"
          style={{ color: C.sage, fontFamily: "'DM Sans', sans-serif" }}
        >
          Looks like you haven't added any flowers yet. Let's change that!
        </p>
        <Link
          to="/bouquets"
          className="flex items-center gap-2 px-7 py-3.5 rounded-full text-white text-sm font-semibold"
          style={{ background: C.emerald, fontFamily: "'DM Sans', sans-serif" }}
        >
          Browse Bouquets <ArrowRight size={15} />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6 md:px-12" style={{ background: C.cream }}>
      <div className="max-w-4xl mx-auto">
        <h1
          className="text-3xl font-bold mb-8"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: C.charcoal }}
        >
          Your Cart <span className="text-lg font-normal text-gray-400">({totalItems} items)</span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items list */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white"
                style={{ border: "1px solid rgba(45,106,79,.08)" }}
              >
                <div
                  className={`w-20 h-20 rounded-xl flex items-center justify-center text-3xl bg-gradient-to-br ${item.gradient} flex-shrink-0`}
                >
                  {item.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-semibold truncate"
                    style={{ color: C.charcoal, fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {item.name}
                  </p>
                  <p
                    className="text-sm font-bold mt-1"
                    style={{ color: C.emerald, fontFamily: "'DM Sans', sans-serif" }}
                  >
                    ${item.price}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQty(item.id, item.qty - 1)}
                    className="w-7 h-7 rounded-full border flex items-center justify-center text-sm font-medium hover:bg-gray-50"
                    style={{ borderColor: "rgba(45,106,79,.2)", color: C.charcoal }}
                  >
                    −
                  </button>
                  <span
                    className="text-sm font-semibold w-5 text-center"
                    style={{ color: C.charcoal, fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {item.qty}
                  </span>
                  <button
                    onClick={() => updateQty(item.id, item.qty + 1)}
                    className="w-7 h-7 rounded-full border flex items-center justify-center text-sm font-medium hover:bg-gray-50"
                    style={{ borderColor: "rgba(45,106,79,.2)", color: C.charcoal }}
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-50 transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 size={15} style={{ color: "#e74c3c" }} />
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div>
            <div
              className="rounded-2xl p-6 bg-white sticky top-24"
              style={{ border: "1px solid rgba(45,106,79,.08)" }}
            >
              <h2
                className="text-lg font-bold mb-5"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", color: C.charcoal }}
              >
                Order Summary
              </h2>
              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm" style={{ color: C.sage, fontFamily: "'DM Sans', sans-serif" }}>
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm" style={{ color: C.sage, fontFamily: "'DM Sans', sans-serif" }}>
                  <span>Delivery</span>
                  <span className="text-emerald-600 font-medium">
                    {totalPrice >= 60 ? "Free" : "$8.99"}
                  </span>
                </div>
                <div
                  className="border-t pt-3 flex justify-between text-base font-bold"
                  style={{ borderColor: "rgba(45,106,79,.1)", color: C.charcoal, fontFamily: "'DM Sans', sans-serif" }}
                >
                  <span>Total</span>
                  <span>${(totalPrice + (totalPrice >= 60 ? 0 : 8.99)).toFixed(2)}</span>
                </div>
              </div>
              <button
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: C.emerald, fontFamily: "'DM Sans', sans-serif" }}
              >
                <ShoppingCart size={15} /> Proceed to Checkout
              </button>
              <Link
                to="/bouquets"
                className="mt-3 flex items-center justify-center gap-1.5 text-xs font-medium"
                style={{ color: C.sage, fontFamily: "'DM Sans', sans-serif" }}
              >
                <Leaf size={11} /> Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
