import { getTenantId } from './tenantStore';

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

async function handleResponse(res) {
  if (res.status === 204) return null;
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(body.detail ?? body.message ?? `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return body;
}

/**
 * Central fetch wrapper.
 * Automatically injects:
 *   - Content-Type: application/json
 *   - X-Tenant-ID  (when a tenant has been resolved via TenantContext)
 *   - Any caller-supplied headers (e.g. Authorization) take precedence.
 */
export function apiFetch(path, options = {}) {
  const tenantId = getTenantId();
  const headers = {
    'Content-Type': 'application/json',
    ...(tenantId ? { 'X-Tenant-ID': tenantId } : {}),
    ...(options.headers ?? {}),
  };
  return fetch(`${BASE}${path}`, { ...options, headers }).then(handleResponse);
}

export { BASE };
