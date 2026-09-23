import { apiFetch } from './apiFetch';

function authHeader(token) {
  return { Authorization: `Bearer ${token}` };
}

/**
 * POST /api/orders
 * Returns { order: OrderDto, checkoutUrl } — checkoutUrl is set only for STRIPE orders
 */
export function placeOrder(token, data) {
  return apiFetch('/api/orders', {
    method: 'POST',
    headers: authHeader(token),
    body: JSON.stringify(data),
  });
}

/**
 * GET /api/payments/stripe/confirm?sessionId=...
 * Syncs the order with Stripe after the redirect back; returns the OrderDto
 */
export function confirmStripePayment(token, sessionId) {
  return apiFetch(`/api/payments/stripe/confirm?sessionId=${encodeURIComponent(sessionId)}`, {
    headers: authHeader(token),
  });
}
