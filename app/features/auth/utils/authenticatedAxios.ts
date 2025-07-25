import axios from 'axios';
import tokenManager from './tokenManager';
import { enhancedLogger } from '@/app/common/utils/logger';
import { API_CONFIG } from '@/app/common/config/constants';

// Create an axios instance with automatic token refresh
export const createAuthenticatedAxios = () => {
  const axiosInstance = axios.create({
    baseURL: API_CONFIG.FULL_URL,
    timeout: 5000,
  });

  // Add request interceptor to include access token
  axiosInstance.interceptors.request.use(
    async config => {
      const accessToken = await tokenManager.getValidAccessToken();
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor to handle 401 errors
  axiosInstance.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;

      // Don't retry timeout errors
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        enhancedLogger.error('Request timeout in interceptor', error);
        return Promise.reject(error);
      }

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const newAccessToken = await tokenManager.getValidAccessToken();
          if (newAccessToken) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest);
          }
        } catch (refreshError: any) {
          enhancedLogger.error('Token refresh failed:', refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

// Export a default instance for convenience
export const authenticatedAxios = createAuthenticatedAxios();
