import { apiFetch } from './apiFetch';

function authHeader(token) {
  return { Authorization: `Bearer ${token}` };
}

/**
 * GET /api/wishlist
 * Returns ProductDto[] for the current storefront, newest first
 */
export function listWishlist(token) {
  return apiFetch('/api/wishlist', { headers: authHeader(token) });
}

/**
 * PUT /api/wishlist/{productId}
 * Returns null (204 No Content)
 */
export function addToWishlist(token, productId) {
  return apiFetch(`/api/wishlist/${productId}`, {
    method: 'PUT',
    headers: authHeader(token),
  });
}

/**
 * DELETE /api/wishlist/{productId}
 * Returns null (204 No Content)
 */
export function removeFromWishlist(token, productId) {
  return apiFetch(`/api/wishlist/${productId}`, {
    method: 'DELETE',
    headers: authHeader(token),
  });
}
