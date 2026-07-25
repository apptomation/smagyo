import { apiFetch } from './apiFetch';

/**
 * POST /api/customers/login
 * Returns { token, name, email }
 */
export function login(email, password) {
  return apiFetch('/api/customers/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

/**
 * POST /api/customers/register
 * Returns { token, name, email }
 */
export function register({ name, email, password }) {
  return apiFetch('/api/customers/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}
