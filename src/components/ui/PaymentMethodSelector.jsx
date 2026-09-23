import { CreditCard, Store } from "lucide-react";

const C = {
  charcoal: "#1C1C1C",
  emerald: "#2D6A4F",
  sage: "#52796F",
};

const OPTIONS = [
  {
    value: "PAY_ON_COLLECTION",
    icon: Store,
    title: "Pay on pickup or delivery",
    description: "Pay at the shop when you collect, or when your order is delivered.",
  },
  {
    value: "STRIPE",
    icon: CreditCard,
    title: "Pay now by card",
    description: "Secure online payment with Stripe.",
  },
];

export default function PaymentMethodSelector({ value, onChange, name = "paymentMethod" }) {
  return (
    <fieldset className="space-y-2.5">
      <legend
        className="text-sm font-semibold mb-3"
        style={{ color: C.charcoal, fontFamily: "'DM Sans', sans-serif" }}
      >
        Payment method
      </legend>
      {OPTIONS.map(({ value: optValue, icon: Icon, title, description }) => {
        const selected = value === optValue;
        return (
          <label
            key={optValue}
            className="flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-emerald-600"
            style={{
              borderColor: selected ? C.emerald : "rgba(45,106,79,.15)",
              background: selected ? "rgba(45,106,79,.05)" : "#fff",
            }}
          >
            <input
              type="radio"
              name={name}
              value={optValue}
              checked={selected}
              onChange={() => onChange(optValue)}
              className="sr-only"
            />
            <span
              className="mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
              style={{ borderColor: selected ? C.emerald : "rgba(45,106,79,.3)" }}
              aria-hidden="true"
            >
              {selected && <span className="w-2 h-2 rounded-full" style={{ background: C.emerald }} />}
            </span>
            <span className="flex-1 min-w-0">
              <span
                className="flex items-center gap-1.5 text-sm font-semibold"
                style={{ color: C.charcoal, fontFamily: "'DM Sans', sans-serif" }}
              >
                <Icon size={14} style={{ color: C.emerald }} /> {title}
              </span>
              <span
                className="block text-xs mt-0.5"
                style={{ color: C.sage, fontFamily: "'DM Sans', sans-serif" }}
              >
                {description}
              </span>
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}
