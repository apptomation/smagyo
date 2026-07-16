/**
 * Module-level tenant store.
 * Decouples the React TenantContext from the API fetch layer —
 * the context calls setTenantId() on resolution, and every API
 * call reads getTenantId() to inject the X-Tenant-ID header.
 */
let _tenantId = null;

export const setTenantId = (id) => { _tenantId = id; };
export const getTenantId = () => _tenantId;
