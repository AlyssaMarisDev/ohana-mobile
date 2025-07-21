import tokenManager from "./tokenManager";
import baseAxios from "./baseAxios";

// Create an axios instance with automatic token refresh
export const createAuthenticatedAxios = () => {
  // Add request interceptor to include access token
  baseAxios.interceptors.request.use(
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
  baseAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const newAccessToken = await tokenManager.getValidAccessToken();
          if (newAccessToken) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return baseAxios(originalRequest);
          }
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          await tokenManager.clearTokens();
        }
      }

      return Promise.reject(error);
    }
  );

  return baseAxios;
};

// Export a default instance for convenience
export const authenticatedAxios = createAuthenticatedAxios();
