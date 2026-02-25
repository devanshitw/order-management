import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

const client = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// The backend ResponseInterceptor wraps all responses as:
//   { success, status_code, data: <actual payload> }
// This interceptor strips the HTTP envelope AND the API envelope,
// so callers get the actual payload directly.
client.interceptors.response.use(
  (response) => {
    const body = response.data;
    // If it's wrapped in our API envelope, unwrap it
    if (body && typeof body === 'object' && 'success' in body && 'data' in body) {
      return body.data;
    }
    return body;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    const errBody = error.response?.data;
    return Promise.reject(errBody?.message || errBody || error.message);
  },
);

export default client;
