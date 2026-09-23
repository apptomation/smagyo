import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { Store, Truck, CheckCircle, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useTenant } from "../context/TenantContext";
import PaymentMethodSelector from "../components/ui/PaymentMethodSelector";
import * as orderApi from "../api/orderApi";

const C = {
  charcoal: "#1C1C1C",
  emerald: "#2D6A4F",
  sage: "#52796F",
  cream: "#FAF7F2",
};

const FULFILLMENT_OPTIONS = [
  { value: "PICKUP",   icon: Store, label: "Pickup in store" },
  { value: "DELIVERY", icon: Truck, label: "Delivery" },
];

const inputClass = "w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 transition";
const inputStyle = { borderColor: "rgba(45,106,79,.15)", color: C.charcoal };

function Field({ label, children }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold" style={{ color: C.sage }}>{label}</span>
      {children}
    </label>
  );
}

export default function CheckoutPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const { items, totalPrice, clearCart, paymentMethod, setPaymentMethod } = useCart();
  const { tenant, tenantId } = useTenant();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [fulfillment, setFulfillment] = useState("PICKUP");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);
  const [authNotice, setAuthNotice] = useState(null);

  const shopName = tenant?.name ?? "the store";
  const payOnline = paymentMethod === "STRIPE";

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
      const { order: created, checkoutUrl } = await orderApi.placeOrder(user.token, {
        tenantId,
        customerName: name,
        customerEmail: email,
        fulfillmentType: fulfillment,
        paymentMethod,
        deliveryAddress: fulfillment === "DELIVERY" ? address : null,
        deliveryCity: fulfillment === "DELIVERY" ? city : null,
        items: items.map((i) => ({ productId: i.id, quantity: i.qty })),
      });

      if (checkoutUrl) {
        // Cart is kept until Stripe confirms payment on /checkout/success
        window.location.assign(checkoutUrl);
        return;
      }
      setOrder(created);
      clearCart();
      setPlacing(false);
    } catch (err) {
      setPlacing(false);
      if (err.status === 401 || err.status === 403) {
        setAuthNotice("Your session has expired. Please sign in again to continue.");
        logout();
        return;
      }
      setError(err.message);
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
          {order.fulfillmentType === "DELIVERY"
            ? `Pay when your order is delivered to ${order.deliveryAddress}, ${order.deliveryCity}.`
            : `Pay when you pick it up at ${shopName}.`}{" "}
          We'll email {order.customerEmail} once it's ready.
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
              <Field label="Full name">
                <input
                  required value={name} onChange={(e) => setName(e.target.value)}
                  autoComplete="name" className={inputClass} style={inputStyle}
                />
              </Field>
              <Field label="Email address">
                <input
                  required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email" className={inputClass} style={inputStyle}
                />
              </Field>
            </div>

            <div
              className="rounded-2xl p-6 bg-white space-y-4"
              style={{ border: "1px solid rgba(45,106,79,.08)" }}
            >
              <h2
                className="text-lg font-bold"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", color: C.charcoal }}
              >
                Pickup or Delivery
              </h2>
              <div className="grid grid-cols-2 gap-2.5" role="radiogroup" aria-label="Pickup or delivery">
                {FULFILLMENT_OPTIONS.map(({ value, icon: Icon, label }) => {
                  const selected = fulfillment === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setFulfillment(value)}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-semibold transition-colors"
                      style={{
                        borderColor: selected ? C.emerald : "rgba(45,106,79,.15)",
                        background: selected ? "rgba(45,106,79,.05)" : "#fff",
                        color: selected ? C.emerald : C.charcoal,
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      <Icon size={15} /> {label}
                    </button>
                  );
                })}
              </div>

              {fulfillment === "PICKUP" ? (
                <p className="text-xs" style={{ color: C.sage, fontFamily: "'DM Sans', sans-serif" }}>
                  Collect your order at {shopName}. We'll email you when it's ready.
                </p>
              ) : (
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <Field label="Street address">
                      <input
                        required value={address} onChange={(e) => setAddress(e.target.value)}
                        autoComplete="street-address" className={inputClass} style={inputStyle}
                      />
                    </Field>
                  </div>
                  <Field label="City">
                    <input
                      required value={city} onChange={(e) => setCity(e.target.value)}
                      autoComplete="address-level2" className={inputClass} style={inputStyle}
                    />
                  </Field>
                </div>
              )}
            </div>

            <div
              className="rounded-2xl p-6 bg-white"
              style={{ border: "1px solid rgba(45,106,79,.08)" }}
            >
              <PaymentMethodSelector value={paymentMethod} onChange={setPaymentMethod} />
            </div>

            {error && (
              <p role="alert" className="text-xs text-red-600 bg-red-50 border border-red-100 px-4 py-2.5 rounded-xl">
                {error}
              </p>
            )}

            <button
              type="submit" disabled={placing}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: C.emerald, fontFamily: "'DM Sans', sans-serif" }}
            >
              {payOnline && <Lock size={14} />}
              {placing
                ? (payOnline ? "Redirecting to secure payment…" : "Placing order…")
                : (payOnline ? `Pay $${totalPrice.toFixed(2)}` : "Place Order")}
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
