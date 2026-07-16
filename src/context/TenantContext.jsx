import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { setTenantId } from '../api/tenantStore';
import { resolveTenantBySubdomain, resolveTenantByDomain } from '../api/tenantApi';

const TenantCtx = createContext(null);

/**
 * Parses window.location.hostname to determine whether the current
 * request is for a specific tenant.
 *
 * Rules:
 *  - localhost             → no tenant (main platform dev)
 *  - exotica.localhost     → subdomain "exotica"  (local multi-tenant dev)
 *  - exotica.smagyo.com    → subdomain "exotica"  (production)
 *  - my-florist.com        → custom domain lookup
 *
 * VITE_PLATFORM_DOMAIN controls the production root domain (default: smagyo.com).
 */
function parseHostname() {
  const hostname = window.location.hostname;
  const parts = hostname.split('.');

  // Plain localhost — no tenant context
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    //return null;
    //for testing, we can return a default tenant for localhost
    return { type: 'subdomain', value: 'proceed' };
  }

  // <subdomain>.localhost  (e.g. exotica.localhost)
  if (parts[parts.length - 1] === 'localhost') {
    return { type: 'subdomain', value: parts[0] };
  }

  // Production: check if this is a subdomain of the platform domain
  const platformDomain = import.meta.env.VITE_PLATFORM_DOMAIN ?? 'smagyo.com';
  const platformParts = platformDomain.split('.');
  if (
    parts.length > platformParts.length &&
    hostname.endsWith(`.${platformDomain}`)
  ) {
    return { type: 'subdomain', value: parts[0] };
  }

  // Custom domain (e.g. my-florist.com)
  return { type: 'domain', value: hostname };
}

export function TenantProvider({ children }) {
  const [tenant,  setTenant]  = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    const parsed = parseHostname();
    if (!parsed) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const data =
          parsed.type === 'subdomain'
            ? await resolveTenantBySubdomain(parsed.value)
            : await resolveTenantByDomain(parsed.value);

        if (!cancelled) {
          setTenant(data);
          setTenantId(data.id); // wire into the apiFetch middleware
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  const value = useMemo(
    () => ({ tenant, tenantId: tenant?.id ?? null, loading, error }),
    [tenant, loading, error],
  );

  return <TenantCtx.Provider value={value}>{children}</TenantCtx.Provider>;
}

export function useTenant() {
  const ctx = useContext(TenantCtx);
  if (!ctx) throw new Error('useTenant must be used within <TenantProvider>');
  return ctx;
}
