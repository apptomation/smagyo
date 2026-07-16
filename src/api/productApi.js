import { apiFetch, BASE } from './apiFetch';
import { getTenantId } from './tenantStore';

function authHeader(token) {
  return { Authorization: `Bearer ${token}` };
}

/**
 * GET /api/products/admin?page=0&size=100
 * Returns Spring Page<ProductDto>: { content: [...], totalElements, ... }
 */
export function listProducts(token, page = 0, size = 100) {
  return apiFetch(`/api/products/admin?page=${page}&size=${size}`, {
    headers: authHeader(token),
  });
}

/**
 * POST /api/products/admin
 * Returns the created ProductDto
 */
export function createProduct(token, data) {
  return apiFetch('/api/products/admin', {
    method: 'POST',
    headers: authHeader(token),
    body: JSON.stringify(data),
  });
}

/**
 * PUT /api/products/admin/{id}
 * Returns the updated ProductDto
 */
export function updateProduct(token, id, data) {
  return apiFetch(`/api/products/admin/${id}`, {
    method: 'PUT',
    headers: authHeader(token),
    body: JSON.stringify(data),
  });
}

/**
 * DELETE /api/products/admin/{id}
 * Returns null (204 No Content)
 */
export function deleteProduct(token, id) {
  return apiFetch(`/api/products/admin/${id}`, {
    method: 'DELETE',
    headers: authHeader(token),
  });
}

/**
 * POST /api/products/admin/images  (multipart/form-data)
 * Uploads an image to Azure Blob Storage and returns { url: "https://..." }.
 * Does NOT use apiFetch because Content-Type must be set by the browser (with boundary).
 */
export async function uploadProductImage(token, file) {
  const tenantId = getTenantId();
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${BASE}/api/products/admin/images`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      ...(tenantId ? { 'X-Tenant-ID': tenantId } : {}),
    },
    body: formData,
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.detail ?? body.message ?? `Upload failed (${res.status})`);
  }
  return body; // { url: "..." }
}
