import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import { useTenant } from "./TenantContext";
import * as wishlistApi from "../api/wishlistApi";
import { toDisplayProduct } from "../utils/displayProduct";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { user, logout } = useAuth();
  const { tenantId } = useTenant();
  const token = user?.token;

  // Results are tagged with the session they belong to, so switching user or
  // storefront never shows a stale list (and no setState is needed on reset).
  const sessionKey = token && tenantId ? `${tenantId}:${token}` : null;
  const [state, setState] = useState({ key: null, items: [] });
  const items   = state.key === sessionKey && sessionKey ? state.items : [];
  const loading = !!sessionKey && state.key !== sessionKey;

  const setItems = useCallback((update) => {
    setState((prev) => ({ ...prev, items: update(prev.items) }));
  }, []);

  // AuthContext's logout isn't memoized — keep it in a ref so it doesn't retrigger the fetch
  const logoutRef = useRef(logout);
  useEffect(() => { logoutRef.current = logout; }, [logout]);

  const handleError = useCallback((err) => {
    // Expired/invalid token → drop the stale session
    if (err.status === 401 || err.status === 403) logoutRef.current();
  }, []);

  useEffect(() => {
    if (!sessionKey) return;
    let cancelled = false;
    wishlistApi.listWishlist(token)
      .then((data) => {
        if (!cancelled) setState({ key: sessionKey, items: data.map(toDisplayProduct) });
      })
      .catch((err) => {
        if (cancelled) return;
        setState({ key: sessionKey, items: [] });
        handleError(err);
      });
    return () => { cancelled = true; };
  }, [sessionKey, token, handleError]);

  const ids = useMemo(() => new Set(items.map((p) => p.id)), [items]);
  const isWishlisted = useCallback((id) => ids.has(id), [ids]);

  /** Optimistic toggle; reverts on failure. Caller must ensure the user is signed in. */
  const toggle = useCallback(async (product) => {
    if (!token) return;
    const wasWishlisted = ids.has(product.id);

    setItems((prev) =>
      wasWishlisted ? prev.filter((p) => p.id !== product.id) : [product, ...prev]
    );

    try {
      if (wasWishlisted) await wishlistApi.removeFromWishlist(token, product.id);
      else await wishlistApi.addToWishlist(token, product.id);
    } catch (err) {
      setItems((prev) =>
        wasWishlisted ? [product, ...prev] : prev.filter((p) => p.id !== product.id)
      );
      handleError(err);
    }
  }, [token, ids, setItems, handleError]);

  return (
    <WishlistContext.Provider value={{ items, loading, count: items.length, isWishlisted, toggle }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
