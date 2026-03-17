import axios from 'axios';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Ensure the base URL is absolute so it is never resolved relative to the
// page origin (which would break deployments on GitHub Pages).
// A value like "termoguard-production.up.railway.app/api" (missing the scheme)
// is treated as a relative path by the browser and gets prepended with the
// page's origin, producing the wrong URL.  Prepend "https://" when the value
// is neither a relative path (starting with "/") nor already contains a scheme.
const baseURL =
  rawBaseUrl && !rawBaseUrl.startsWith('/') && !/^https?:\/\//i.test(rawBaseUrl)
    ? `https://${rawBaseUrl}`
    : rawBaseUrl;

const api = axios.create({
  baseURL,
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
