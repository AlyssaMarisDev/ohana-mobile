import axios from "axios";
import tokenManager from "./tokenManager";
import { API_CONFIG } from "../config/constants";

// Create an axios instance with automatic token refresh
export const createAuthenticatedAxios = () => {
  const instance = axios.create({
    baseURL: API_CONFIG.FULL_URL,
  });

  // Add request interceptor to include access token
  instance.interceptors.request.use(
    async (config) => {
      const accessToken = await tokenManager.getValidAccessToken();
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor to handle 401 errors
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const newAccessToken = await tokenManager.getValidAccessToken();
          if (newAccessToken) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return instance(originalRequest);
          }
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          await tokenManager.clearTokens();
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

// Export a default instance for convenience
export const authenticatedAxios = createAuthenticatedAxios();
