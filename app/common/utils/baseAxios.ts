import axios from 'axios';
import { API_CONFIG } from '../config/constants';
import { enhancedLogger } from './logger';

const instance = axios.create({
  baseURL: API_CONFIG.FULL_URL,
  timeout: 5000,
  // Add additional timeout configurations for React Native
  timeoutErrorMessage: 'Request timeout after 5 seconds',
});

// Add request interceptor to log timeout configuration
instance.interceptors.request.use(
  config => {
    enhancedLogger.debug('Request config', {
      url: config.url,
      timeout: config.timeout,
      baseURL: config.baseURL,
      method: config.method,
    });
    return config;
  },
  error => {
    enhancedLogger.error('Request interceptor error', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to log all responses
instance.interceptors.response.use(
  response => {
    enhancedLogger.debug('Response received', {
      url: response.config.url,
      status: response.status,
    });
    return response;
  },
  error => {
    enhancedLogger.error('Response error', error, {
      url: error.config?.url,
      status: error.response?.status,
      code: error.code,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

export default instance;
