import axios from 'axios';

// Base API configuration from environment or default to local backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach dynamic Tenant Context and Auth Token
apiClient.interceptors.request.use(
  (config) => {
    // Read active tenant from localStorage to mirror multi-tenant AsyncLocalStorage context
    const currentTenant = localStorage.getItem('wf_active_tenant') || 'acme_corp';
    config.headers['X-Tenant-ID'] = currentTenant;

    const authToken = localStorage.getItem('wf_auth_token');
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with graceful error extraction
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = {
      message: error.response?.data?.message || error.message || 'An unexpected API error occurred',
      status: error.response?.status || 500,
      details: error.response?.data?.details || null,
      isOffline: !error.response,
    };
    return Promise.reject(customError);
  }
);

export default apiClient;
