import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

/**
 * A custom hook for making API requests with loading and error states
 * 
 * @param {string} url - The API endpoint to fetch from
 * @param {Object} options - Additional options for the request
 * @returns {Object} An object containing the data, loading state, error, and refetch function
 */
export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.request({
        url,
        ...options,
      });
      
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * A custom hook for making paginated API requests
 * 
 * @param {string} url - The API endpoint to fetch from
 * @param {Object} options - Additional options for the request
 * @returns {Object} An object containing the paginated data, loading state, error, and pagination functions
 */
export const usePaginatedFetch = (url, options = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchData = useCallback(async (page = 1, limit = 10, filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.request({
        url,
        params: {
          page,
          limit,
          ...filters,
        },
        ...options,
      });
      
      setData(response.data.data || []);
      setPagination({
        page: response.data.page || 1,
        limit: response.data.limit || 10,
        total: response.data.total || 0,
        totalPages: response.data.totalPages || 0,
      });
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    fetchData(pagination.page, pagination.limit);
  }, [fetchData, pagination.page, pagination.limit]);

  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page }));
    }
  };

  const nextPage = () => {
    goToPage(pagination.page + 1);
  };

  const prevPage = () => {
    goToPage(pagination.page - 1);
  };

  const changeLimit = (limit) => {
    setPagination((prev) => ({ ...prev, limit, page: 1 }));
  };

  return {
    data,
    loading,
    error,
    pagination,
    refetch: fetchData,
    goToPage,
    nextPage,
    prevPage,
    changeLimit,
  };
};