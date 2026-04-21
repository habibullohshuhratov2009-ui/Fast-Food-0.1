const BASE_URL = 'http://localhost:5050/api';

/**
 * Centralized fetch wrapper for all API calls
 */
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
}

// ── Products ──────────────────────────────────────────
export const productsAPI = {
  getAll: (params = '') => request(`/products${params ? `?${params}` : ''}`),
  getById: (id) => request(`/products/${id}`),
  create: (body) => request('/products', { method: 'POST', body }),
  update: (id, body) => request(`/products/${id}`, { method: 'PATCH', body }),
  delete: (id) => request(`/products/${id}`, { method: 'DELETE' }),
};

// ── Orders ────────────────────────────────────────────
export const ordersAPI = {
  getAll: (params = '') => request(`/orders${params ? `?${params}` : ''}`),
  getById: (id) => request(`/orders/${id}`),
  create: (body) => request('/orders', { method: 'POST', body }),
  update: (id, body) => request(`/orders/${id}`, { method: 'PATCH', body }),
};

// ── Categories ────────────────────────────────────────
export const categoriesAPI = {
  getAll: () => request('/categories'),
  getById: (id) => request(`/categories/${id}`),
  create: (body) => request('/categories', { method: 'POST', body }),
  update: (id, body) => request(`/categories/${id}`, { method: 'PATCH', body }),
  delete: (id) => request(`/categories/${id}`, { method: 'DELETE' }),
};

// ── Auth ──────────────────────────────────────────────
export const authAPI = {
  login: (username, password) => request('/login', { method: 'POST', body: { username, password } }),
};
