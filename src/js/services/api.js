/**
 * API Service untuk integrasi dengan backend
 */

import { getAuthToken } from './auth';

// API base URL
const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Membuat options untuk fetch API
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {Object|null} data - Data untuk dikirim (untuk POST, PUT)
 * @returns {Object} Fetch options
 */
function createFetchOptions(method, data = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };
  
  // Add auth token if available
  const token = getAuthToken();
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Add body for POST, PUT methods
  if (data && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(data);
  }
  
  return options;
}

/**
 * Handle API response
 * @param {Response} response - Fetch response
 * @returns {Promise<any>} Response data
 * @throws {Error} If response is not OK
 */
async function handleResponse(response) {
  // Parse response as JSON
  const data = await response.json();
  
  // Check if response is OK
  if (!response.ok) {
    // Try to get error message from response
    const message = data?.message || `HTTP error ${response.status}`;
    throw new Error(message);
  }
  
  return data;
}

/**
 * Fetch wrapper with error handling
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} Response data
 */
async function fetchApi(endpoint, options) {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, options);
    return await handleResponse(response);
  } catch (error) {
    console.error(`API Error: ${error.message}`);
    throw error;
  }
}

/**
 * GET request
 * @param {string} endpoint - API endpoint
 * @returns {Promise<any>} Response data
 */
export function get(endpoint) {
  return fetchApi(endpoint, createFetchOptions('GET'));
}

/**
 * POST request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Data to send
 * @returns {Promise<any>} Response data
 */
export function post(endpoint, data) {
  return fetchApi(endpoint, createFetchOptions('POST', data));
}

/**
 * PUT request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Data to send
 * @returns {Promise<any>} Response data
 */
export function put(endpoint, data) {
  return fetchApi(endpoint, createFetchOptions('PUT', data));
}

/**
 * DELETE request
 * @param {string} endpoint - API endpoint
 * @returns {Promise<any>} Response data
 */
export function del(endpoint) {
  return fetchApi(endpoint, createFetchOptions('DELETE'));
}

/**
 * Upload file(s)
 * @param {string} endpoint - API endpoint
 * @param {FormData} formData - Form data with files
 * @returns {Promise<any>} Response data
 */
export async function uploadFile(endpoint, formData) {
  const options = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
    },
    body: formData,
  };
  
  // Add auth token if available
  const token = getAuthToken();
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }
  
  return fetchApi(endpoint, options);
}

// API Endpoints untuk entitas-entitas aplikasi

/**
 * Menu API
 */
export const menuApi = {
  getAll: () => get('/menus'),
  getById: (id) => get(`/menus/${id}`),
  create: (data) => post('/menus', data),
  update: (id, data) => put(`/menus/${id}`, data),
  delete: (id) => del(`/menus/${id}`),
  updateStatus: (id, status) => put(`/menus/${id}/status`, { status }),
  uploadImage: (id, formData) => uploadFile(`/menus/${id}/image`, formData),
  getByCategory: (categoryId) => get(`/categories/${categoryId}/menus`),
};

/**
 * Category API
 */
export const categoryApi = {
  getAll: () => get('/categories'),
  getById: (id) => get(`/categories/${id}`),
  create: (data) => post('/categories', data),
  update: (id, data) => put(`/categories/${id}`, data),
  delete: (id) => del(`/categories/${id}`),
  updateOrder: (data) => put('/categories/order', data),
};

/**
 * Order API
 */
export const orderApi = {
  getAll: () => get('/orders'),
  getById: (id) => get(`/orders/${id}`),
  create: (data) => post('/orders', data),
  update: (id, data) => put(`/orders/${id}`, data),
  updateStatus: (id, status) => put(`/orders/${id}/status`, { status }),
  getByDateRange: (startDate, endDate) => get(`/orders?startDate=${startDate}&endDate=${endDate}`),
  getTodayOrders: () => get('/orders/today'),
};

/**
 * Table API
 */
export const tableApi = {
  getAll: () => get('/tables'),
  getById: (id) => get(`/tables/${id}`),
  create: (data) => post('/tables', data),
  update: (id, data) => put(`/tables/${id}`, data),
  delete: (id) => del(`/tables/${id}`),
};

/**
 * Reservation API
 */
export const reservationApi = {
  getAll: () => get('/reservations'),
  getById: (id) => get(`/reservations/${id}`),
  create: (data) => post('/reservations', data),
  update: (id, data) => put(`/reservations/${id}`, data),
  delete: (id) => del(`/reservations/${id}`),
  updateStatus: (id, status) => put(`/reservations/${id}/status`, { status }),
  getByDateRange: (startDate, endDate) => get(`/reservations?startDate=${startDate}&endDate=${endDate}`),
  getTodayReservations: () => get('/reservations/today'),
};

/**
 * Payment API
 */
export const paymentApi = {
  getAll: () => get('/payments'),
  getById: (id) => get(`/payments/${id}`),
  create: (data) => post('/payments', data),
  update: (id, data) => put(`/payments/${id}`, data),
  getByOrderId: (orderId) => get(`/orders/${orderId}/payment`),
  getByDateRange: (startDate, endDate) => get(`/payments?startDate=${startDate}&endDate=${endDate}`),
};

/**
 * Dashboard API
 */
export const dashboardApi = {
  getSummary: () => get('/dashboard/summary'),
  getOrderStats: (period) => get(`/dashboard/orders?period=${period}`),
  getRevenueStats: (period) => get(`/dashboard/revenue?period=${period}`),
  getTopItems: (limit = 5) => get(`/dashboard/top-items?limit=${limit}`),
  getRecentOrders: (limit = 5) => get(`/dashboard/recent-orders?limit=${limit}`),
};

/**
 * User API
 */
export const userApi = {
  getAll: () => get('/users'),
  getById: (id) => get(`/users/${id}`),
  create: (data) => post('/users', data),
  update: (id, data) => put(`/users/${id}`, data),
  delete: (id) => del(`/users/${id}`),
  changePassword: (id, data) => put(`/users/${id}/change-password`, data),
  getProfile: () => get('/users/profile'),
  updateProfile: (data) => put('/users/profile', data),
};

/**
 * Analytics API
 */
export const analyticsApi = {
  getSalesByCategory: (startDate, endDate) => get(`/analytics/sales-by-category?startDate=${startDate}&endDate=${endDate}`),
  getSalesByItem: (startDate, endDate) => get(`/analytics/sales-by-item?startDate=${startDate}&endDate=${endDate}`),
  getSalesByTime: (startDate, endDate, groupBy = 'day') => get(`/analytics/sales-by-time?startDate=${startDate}&endDate=${endDate}&groupBy=${groupBy}`),
  getTableOccupancy: (startDate, endDate) => get(`/analytics/table-occupancy?startDate=${startDate}&endDate=${endDate}`),
  exportData: (type, startDate, endDate) => get(`/analytics/export?type=${type}&startDate=${startDate}&endDate=${endDate}`),
};