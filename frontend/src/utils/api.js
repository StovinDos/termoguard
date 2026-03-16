import axios from 'axios';

// Points to your LOCAL Spring Boot server (only active when running on your laptop)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 5000,
});

// Track whether the backend is reachable
export let backendOnline = false;

api.interceptors.response.use(
  (response) => {
    backendOnline = true;
    return response;
  },
  (error) => {
    // Network error = backend offline (demo mode without laptop server)
    if (!error.response) {
      backendOnline = false;
      return Promise.reject(new Error('BACKEND_OFFLINE'));
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';

    if (error.response?.status === 401) {
      localStorage.removeItem('tg_token');
      delete api.defaults.headers.common['Authorization'];
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
