const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

async function handleResponse(res) {
  if (res.status === 204) return null;
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.detail ?? body.message ?? `Request failed (${res.status})`);
  }
  return body;
}

function authHeaders(token) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

/**
 * GET /api/products/admin?page=0&size=100
 * Returns Spring Page<ProductDto>: { content: [...], totalElements, ... }
 */
export function listProducts(token, page = 0, size = 100) {
  return fetch(`${BASE}/api/products/admin?page=${page}&size=${size}`, {
    headers: authHeaders(token),
  }).then(handleResponse);
}

/**
 * POST /api/products/admin
 * Returns the created ProductDto
 */
export function createProduct(token, data) {
  return fetch(`${BASE}/api/products/admin`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  }).then(handleResponse);
}

/**
 * PUT /api/products/admin/{id}
 * Returns the updated ProductDto
 */
export function updateProduct(token, id, data) {
  return fetch(`${BASE}/api/products/admin/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  }).then(handleResponse);
}

/**
 * DELETE /api/products/admin/{id}
 * Returns null (204 No Content)
 */
export function deleteProduct(token, id) {
  return fetch(`${BASE}/api/products/admin/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  }).then(handleResponse);
}
