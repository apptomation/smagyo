import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { Store, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useTenant } from "../context/TenantContext";
import * as orderApi from "../api/orderApi";

const C = {
  charcoal: "#1C1C1C",
  emerald: "#2D6A4F",
  sage: "#52796F",
  cream: "#FAF7F2",
};

export default function CheckoutPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const { tenant, tenantId } = useTenant();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);
  const [authNotice, setAuthNotice] = useState(null);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: "/checkout", notice: authNotice }} replace />;
  }
  if (items.length === 0 && !order) {
    return <Navigate to="/cart" replace />;
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");
    setPlacing(true);
    try {
      const created = await orderApi.placeOrder(user.token, {
        tenantId,
        customerName: name,
        customerEmail: email,
        items: items.map((i) => ({
          productId: i.id,
          productName: i.name,
          quantity: i.qty,
          unitPrice: i.price,
        })),
      });
      setOrder(created);
      clearCart();
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        setAuthNotice("Your session has expired. Please sign in again to continue.");
        logout();
        return;
      }
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  };

  if (order) {
    return (
      <div
        className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-20 text-center"
        style={{ background: C.cream }}
      >
        <CheckCircle size={56} className="mb-6" style={{ color: C.emerald }} />
        <h1
          className="text-3xl font-bold mb-3"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: C.charcoal }}
        >
          Order Placed!
        </h1>
        <p className="text-base mb-2" style={{ color: C.charcoal, fontFamily: "'DM Sans', sans-serif" }}>
          Order #{order.id.slice(0, 8)} · ${order.total.toFixed(2)}
        </p>
        <p className="text-sm mb-8 max-w-sm" style={{ color: C.sage, fontFamily: "'DM Sans', sans-serif" }}>
          Pay when you pick it up at {tenant?.name ?? "the store"}. We'll email {order.customerEmail} once it's ready.
        </p>
        <Link
          to="/"
          className="flex items-center gap-2 px-7 py-3.5 rounded-full text-white text-sm font-semibold"
          style={{ background: C.emerald, fontFamily: "'DM Sans', sans-serif" }}
        >
          Continue Shopping
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
          Checkout
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <form onSubmit={handlePlaceOrder} className="lg:col-span-2 space-y-4">
            <div
              className="rounded-2xl p-6 bg-white space-y-4"
              style={{ border: "1px solid rgba(45,106,79,.08)" }}
            >
              <h2
                className="text-lg font-bold"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", color: C.charcoal }}
              >
                Contact Details
              </h2>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold" style={{ color: C.sage }}>Full name</label>
                <input
                  required value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 transition"
                  style={{ borderColor: "rgba(45,106,79,.15)", color: C.charcoal }}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold" style={{ color: C.sage }}>Email address</label>
                <input
                  required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 transition"
                  style={{ borderColor: "rgba(45,106,79,.15)", color: C.charcoal }}
                />
              </div>
            </div>

            <div
              className="rounded-2xl p-6 bg-white flex items-start gap-3"
              style={{ border: "1px solid rgba(45,106,79,.08)" }}
            >
              <Store size={18} style={{ color: C.emerald }} className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold" style={{ color: C.charcoal, fontFamily: "'DM Sans', sans-serif" }}>
                  Pickup in store
                </p>
                <p className="text-xs mt-1" style={{ color: C.sage, fontFamily: "'DM Sans', sans-serif" }}>
                  No payment needed now — pay when you pick up your order at {tenant?.name ?? "the store"}.
                </p>
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-100 px-4 py-2.5 rounded-xl">
                {error}
              </p>
            )}

            <button
              type="submit" disabled={placing}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: C.emerald, fontFamily: "'DM Sans', sans-serif" }}
            >
              {placing ? "Placing order…" : "Place Order"}
            </button>
          </form>

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
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm"
                    style={{ color: C.sage, fontFamily: "'DM Sans', sans-serif" }}
                  >
                    <span>{item.name} × {item.qty}</span>
                    <span>${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div
                className="border-t pt-3 flex justify-between text-base font-bold"
                style={{ borderColor: "rgba(45,106,79,.1)", color: C.charcoal, fontFamily: "'DM Sans', sans-serif" }}
              >
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
