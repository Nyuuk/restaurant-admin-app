import api from './api';

/**
 * Login user with credentials
 * @param {Object} credentials - User credentials (username, password)
 * @returns {Promise<Object>} User and token data
 */
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get current logged in user
 * @returns {Promise<Object>} User data
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error;
  }
};