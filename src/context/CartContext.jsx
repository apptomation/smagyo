import { createContext, useContext, useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "smagyo_cart";

const CartContext = createContext(null);

// Persisted so the cart survives the full-page round-trip to Stripe Checkout
function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && Array.isArray(saved.items)) return saved;
  } catch { /* storage unavailable or corrupt — start fresh */ }
  return { items: [], paymentMethod: "PAY_ON_COLLECTION" };
}

export function CartProvider({ children }) {
  const [initial] = useState(loadCart);
  const [items, setItems] = useState(initial.items);
  /** "PAY_ON_COLLECTION" | "STRIPE" */
  const [paymentMethod, setPaymentMethod] = useState(initial.paymentMethod);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, paymentMethod }));
    } catch { /* ignore — cart just won't persist */ }
  }, [items, paymentMethod]);

  const addItem = useCallback((product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQty = useCallback((id, qty) => {
    if (qty < 1) return;
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty } : i))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items, addItem, removeItem, updateQty, clearCart, totalItems, totalPrice,
        paymentMethod, setPaymentMethod,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
