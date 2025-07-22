import {
  getApiUrl,
  getConfig,
  isDevelopment,
  isProduction,
  isStaging,
} from './environment';

// API Configuration - now uses environment variables
export const API_CONFIG = {
  BASE_URL: getConfig().apiBaseUrl,
  API_VERSION: getConfig().apiVersion,
  FULL_URL: getApiUrl(),
} as const;

// Environment-specific configurations
export const ENV_CONFIG = {
  DEVELOPMENT: {
    API_BASE_URL: getConfig().apiBaseUrl,
  },
  PRODUCTION: {
    API_BASE_URL: getConfig().apiBaseUrl,
  },
} as const;

// Get the current environment
export const getCurrentEnv = () => {
  if (isDevelopment()) return 'DEVELOPMENT';
  if (isStaging()) return 'STAGING';
  if (isProduction()) return 'PRODUCTION';
  return 'DEVELOPMENT'; // fallback
};

// Get the appropriate API URL for the current environment
export const getApiUrlFromConstants = () => {
  return getApiUrl();
};

// Re-export environment functions for convenience
export {
  getApiUrl,
  getConfig,
  isDevelopment,
  isProduction,
  isStaging,
} from './environment';
