import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Response interceptor — surface clean error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';

    // 401 — clear stored credentials
    if (error.response?.status === 401) {
      localStorage.removeItem('tg_token');
      delete api.defaults.headers.common['Authorization'];
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
