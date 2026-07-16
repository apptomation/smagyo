import { apiFetch } from './apiFetch';

/**
 * Resolve a tenant by its subdomain slug (e.g. "exotica").
 * Used by TenantContext during app boot — at this point tenantId isn't
 * set yet so no X-Tenant-ID header is sent for this one call.
 * Returns TenantDto: { id, name, subdomain, customDomain, plan, status,
 *                      primaryColor, accentColor, logoEmoji, createdAt }
 */
export function resolveTenantBySubdomain(subdomain) {
  return apiFetch(`/api/tenants/resolve?subdomain=${encodeURIComponent(subdomain)}`);
}

/**
 * Resolve a tenant by its custom domain (e.g. "my-florist.com").
 */
export function resolveTenantByDomain(domain) {
  return apiFetch(`/api/tenants/resolve?domain=${encodeURIComponent(domain)}`);
}

/**
 * Public storefront: list all active products for the resolved tenant.
 * X-Tenant-ID header is injected automatically by apiFetch once the
 * tenant is resolved. The tenantId query param is also sent as a fallback.
 */
export function listPublicProducts(tenantId) {
  return apiFetch(`/api/products?tenantId=${encodeURIComponent(tenantId)}`);
}
