import { useEffect, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { CheckCircle, Clock, AlertCircle, Loader2 } from "lucide-react";
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

/** Stripe redirects here with ?session_id=cs_... after a successful card payment. */
export default function CheckoutSuccessPage() {
  const { user, isAuthenticated } = useAuth();
  const { clearCart } = useCart();
  const { tenant } = useTenant();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  const token = user?.token;

  useEffect(() => {
    if (!token || !sessionId) return;
    let cancelled = false;
    orderApi.confirmStripePayment(token, sessionId)
      .then((confirmed) => {
        if (cancelled) return;
        setOrder(confirmed);
        if (confirmed.paymentStatus === "PAID") clearCart();
      })
      .catch((err) => { if (!cancelled) setError(err.message); });
    return () => { cancelled = true; };
  }, [token, sessionId, clearCart]);

  if (!sessionId) return <Navigate to="/cart" replace />;
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: `/checkout/success?session_id=${sessionId}`, notice: "Sign in to see your order confirmation." }}
        replace
      />
    );
  }

  const paid = order?.paymentStatus === "PAID";
  const Icon = error ? AlertCircle : !order ? Loader2 : paid ? CheckCircle : Clock;
  const title = error
    ? "We couldn't confirm your payment"
    : !order ? "Confirming your payment…"
    : paid ? "Payment received!"
    : "Payment processing";

  return (
    <div
      className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-20 text-center"
      style={{ background: C.cream }}
    >
      <Icon
        size={56}
        className={`mb-6 ${!order && !error ? "animate-spin" : ""}`}
        style={{ color: error ? "#c0392b" : C.emerald }}
      />
      <h1
        className="text-3xl font-bold mb-3"
        style={{ fontFamily: "'Playfair Display', Georgia, serif", color: C.charcoal }}
        aria-live="polite"
      >
        {title}
      </h1>

      {order && (
        <>
          <p className="text-base mb-2" style={{ color: C.charcoal, fontFamily: "'DM Sans', sans-serif" }}>
            Order #{order.id.slice(0, 8)} · ${order.total.toFixed(2)}
          </p>
          <p className="text-sm mb-8 max-w-sm" style={{ color: C.sage, fontFamily: "'DM Sans', sans-serif" }}>
            {paid
              ? order.fulfillmentType === "DELIVERY"
                ? `Your order will be delivered to ${order.deliveryAddress}, ${order.deliveryCity}.`
                : `Your order will be ready for pickup at ${tenant?.name ?? "the store"}.`
              : "Your bank is still confirming the payment. We'll email you as soon as it goes through."}{" "}
            A confirmation will be sent to {order.customerEmail}.
          </p>
        </>
      )}

      {error && (
        <p className="text-sm mb-8 max-w-sm" style={{ color: C.sage, fontFamily: "'DM Sans', sans-serif" }}>
          {error} If you were charged, your order is safe — please contact {tenant?.name ?? "the shop"}.
        </p>
      )}

      {(order || error) && (
        <Link
          to="/"
          className="flex items-center gap-2 px-7 py-3.5 rounded-full text-white text-sm font-semibold"
          style={{ background: C.emerald, fontFamily: "'DM Sans', sans-serif" }}
        >
          Continue Shopping
        </Link>
      )}
    </div>
  );
}
