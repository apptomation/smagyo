import { apiFetch } from './apiFetch';

/**
 * POST /api/auth/login
 * Returns { token, role, tenantId, tenantName, name, avatar }
 */
export function login(email, password) {
  return apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

/**
 * POST /api/auth/register  (creates Tenant + TENANT_ADMIN user)
 * Returns 201 No Content on success.
 */
export function register({ name, email, password, storeName, subdomain }) {
  return apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, storeName, subdomain }),
  });
}
