import { apiFetch } from './apiFetch';

function authHeader(token) {
  return { Authorization: `Bearer ${token}` };
}

/**
 * POST /api/orders
 * Returns the created OrderDto
 */
export function placeOrder(token, data) {
  return apiFetch('/api/orders', {
    method: 'POST',
    headers: authHeader(token),
    body: JSON.stringify(data),
  });
}
