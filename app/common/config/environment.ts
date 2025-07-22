import Constants from 'expo-constants';
import {
  API_BASE_URL,
  API_VERSION,
  ENABLE_ANALYTICS,
  ENABLE_CRASH_REPORTING,
  DEBUG_MODE,
} from '@env';

export type Environment = 'development' | 'staging' | 'production';

interface EnvironmentConfig {
  apiBaseUrl: string;
  apiVersion: string;
  enableAnalytics: boolean;
  enableCrashReporting: boolean;
  debugMode: boolean;
}

const getEnvironment = (): Environment => {
  if (__DEV__) return 'development';

  // You can add logic here to detect staging vs production
  // For example, using different bundle identifiers or build configurations
  const bundleId =
    Constants.expoConfig?.ios?.bundleIdentifier ||
    Constants.expoConfig?.android?.package;

  if (bundleId?.includes('staging')) return 'staging';
  return 'production';
};

// Helper function to parse boolean from environment variable
const parseBoolean = (
  value: string | undefined,
  defaultValue: boolean
): boolean => {
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true';
};

// Helper function to get environment variable with fallback
const getEnvVar = (value: string | undefined, fallback: string): string => {
  return value || fallback;
};

// Helper function to get API URL for specific environment
const getApiUrlForEnvironment = (environment: Environment): string => {
  switch (environment) {
    case 'development':
      return getEnvVar(API_BASE_URL, 'http://10.0.2.2:4242');
    case 'staging':
      return getEnvVar(API_BASE_URL, 'https://staging-api.ohana.com');
    case 'production':
      return getEnvVar(API_BASE_URL, 'https://api.ohana.com');
    default:
      return getEnvVar(API_BASE_URL, 'http://10.0.2.2:4242');
  }
};

const configs: Record<Environment, EnvironmentConfig> = {
  development: {
    apiBaseUrl: getApiUrlForEnvironment('development'),
    apiVersion: getEnvVar(API_VERSION, 'v1'),
    enableAnalytics: parseBoolean(ENABLE_ANALYTICS, false),
    enableCrashReporting: parseBoolean(ENABLE_CRASH_REPORTING, false),
    debugMode: parseBoolean(DEBUG_MODE, true),
  },
  staging: {
    apiBaseUrl: getApiUrlForEnvironment('staging'),
    apiVersion: getEnvVar(API_VERSION, 'v1'),
    enableAnalytics: parseBoolean(ENABLE_ANALYTICS, true),
    enableCrashReporting: parseBoolean(ENABLE_CRASH_REPORTING, true),
    debugMode: parseBoolean(DEBUG_MODE, false),
  },
  production: {
    apiBaseUrl: getApiUrlForEnvironment('production'),
    apiVersion: getEnvVar(API_VERSION, 'v1'),
    enableAnalytics: parseBoolean(ENABLE_ANALYTICS, true),
    enableCrashReporting: parseBoolean(ENABLE_CRASH_REPORTING, true),
    debugMode: parseBoolean(DEBUG_MODE, false),
  },
};

export const getConfig = (): EnvironmentConfig => {
  const env = getEnvironment();
  return configs[env];
};

export const getApiUrl = (): string => {
  const config = getConfig();
  return `${config.apiBaseUrl}/api/${config.apiVersion}`;
};

export const isDevelopment = (): boolean => getEnvironment() === 'development';
export const isProduction = (): boolean => getEnvironment() === 'production';
export const isStaging = (): boolean => getEnvironment() === 'staging';

// Export individual config values for direct access
export const getApiBaseUrl = (): string => getConfig().apiBaseUrl;
export const getApiVersion = (): string => getConfig().apiVersion;
export const shouldEnableAnalytics = (): boolean => getConfig().enableAnalytics;
export const shouldEnableCrashReporting = (): boolean =>
  getConfig().enableCrashReporting;
export const isDebugMode = (): boolean => getConfig().debugMode;
