// API Configuration
export const API_CONFIG = {
  BASE_URL: "http://10.0.2.2:4242",
  API_VERSION: "v1",
  FULL_URL: "http://10.0.2.2:4242/api/v1",
} as const;

// Environment-specific configurations
export const ENV_CONFIG = {
  DEVELOPMENT: {
    API_BASE_URL: "http://10.0.2.2:4242",
  },
  PRODUCTION: {
    API_BASE_URL: "https://your-production-api.com", // Update this when you have a production API
  },
} as const;

// Get the current environment (you can modify this based on your build process)
export const getCurrentEnv = () => {
  // For now, default to development
  // You can add logic here to detect environment based on __DEV__ or other flags
  return __DEV__ ? "DEVELOPMENT" : "PRODUCTION";
};

// Get the appropriate API URL for the current environment
export const getApiUrl = () => {
  const env = getCurrentEnv();
  const baseUrl = ENV_CONFIG[env as keyof typeof ENV_CONFIG].API_BASE_URL;
  return `${baseUrl}/api/v1`;
};
