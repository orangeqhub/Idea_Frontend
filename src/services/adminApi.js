import axios from 'axios';

// const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001';
const baseURL = import.meta.env.VITE_API_BASE_URL;

export const adminApi = axios.create({
  baseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

function getCsrfToken() {
  const match = document.cookie.match(/(?:^|;\s*)csrf-token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

adminApi.interceptors.request.use((config) => {
  // Inject JWT Bearer Token if it exists in local storage
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  const method = config.method?.toUpperCase();
  if (method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    const csrf = getCsrfToken();
    if (csrf) config.headers['X-CSRF-Token'] = csrf;
  }
  return config;
});

let isRefreshing = false;
adminApi.interceptors.response.use(
  r => r,
  async (error) => {
    if (error.response?.status === 401 && !isRefreshing && !error.config?.['_retry']) {
      isRefreshing = true;
      try {
        // Attempt mock refresh request
        await axios.post(`${baseURL}/admin/auth/refresh`, {}, { withCredentials: true });
        if (error.config) error.config['_retry'] = true;
        isRefreshing = false;
        return adminApi(error.config);
      } catch {
        isRefreshing = false;
        localStorage.removeItem('adminToken');
        if (window.location.pathname !== '/admin/login') {
          window.location.href = '/admin/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

