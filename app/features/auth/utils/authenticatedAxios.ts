import tokenManager from './tokenManager';
import baseAxios from '../../../common/utils/baseAxios';
import { enhancedLogger } from '@/app/common/utils/logger';

// Create an axios instance with automatic token refresh
export const createAuthenticatedAxios = () => {
  // Add request interceptor to include access token
  baseAxios.interceptors.request.use(
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
  baseAxios.interceptors.response.use(
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
            return baseAxios(originalRequest);
          }
        } catch (refreshError: any) {
          enhancedLogger.error('Token refresh failed:', refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return baseAxios;
};

// Export a default instance for convenience
export const authenticatedAxios = createAuthenticatedAxios();
