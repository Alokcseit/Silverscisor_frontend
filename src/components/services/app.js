// src/services/api.js (Axios interceptors)

import axios from 'axios';
import { store } from '../../store';
import { logout, setAccessToken } from '../../store/authSlice';

const api = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URL,
  timeout: 30000, // 30 second request timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Token expire ho gaya
    const requestUrl = originalRequest?.url || '';
    const isAuthEndpoint = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/refresh-token') || requestUrl.includes('/auth/forgot-password') || requestUrl.includes('/auth/reset-password');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      try {
        // Refresh token se naya access token lo
        const refreshToken = store.getState().auth.refreshToken;
        const response = await axios.post(`${import.meta.env.VITE_AUTH_API_URL}/api/auth/refresh-token`, {
          refreshToken
        });

        const newToken = response.data.data.accessToken;
        
        // Store mein update karo
        store.dispatch(setAccessToken(newToken));
        
        // Original request retry karo
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        // Refresh bhi fail → logout
        store.dispatch(logout());
        window.location.href = '/auth';
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 401 && isAuthEndpoint) {
      return Promise.reject(error);
    }

    // Network error
    if (!error.response) {
      return Promise.reject({
        message: 'Network error. Please check your internet connection.'
      });
    }

    // Server error
    if (error.response?.status >= 500) {
      return Promise.reject({
        message: 'Server error. Please try again later.'
      });
    }

    return Promise.reject(error);
  }
);

export default api;