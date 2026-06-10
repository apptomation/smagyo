const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

/**
 * Parse Spring Boot error responses.
 * Spring Boot 3.x uses RFC 9457 Problem Details format:
 * { "detail": "...", "title": "...", "status": 409 }
 */
async function handleResponse(res) {
  if (res.status === 204 || res.status === 201) return null;
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.detail ?? body.message ?? `Request failed (${res.status})`);
  }
  return body;
}

/**
 * POST /api/auth/login
 * Returns { token, role, tenantId, tenantName, name, avatar }
 */
export function login(email, password) {
  return fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then(handleResponse);
}

/**
 * POST /api/auth/register  (creates Tenant + TENANT_ADMIN user)
 * Returns 201 No Content on success.
 */
export function register({ name, email, password, storeName, subdomain }) {
  return fetch(`${BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, storeName, subdomain }),
  }).then(handleResponse);
}
