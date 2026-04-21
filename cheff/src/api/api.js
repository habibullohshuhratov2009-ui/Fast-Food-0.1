const BASE_URL = 'http://localhost:5050/api';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };
  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }
  const response = await fetch(url, config);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Something went wrong');
  return data;
}

export const ordersAPI = {
  getAll: (params = '') => request(`/orders${params ? `?${params}` : ''}`),
  getById: (id) => request(`/orders/${id}`),
  update: (id, body) => request(`/orders/${id}`, { method: 'PATCH', body }),
};
