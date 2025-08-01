import { logger } from '@/app/common/utils/logger';
import {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';

export class BaseService {
  protected axiosInstance: AxiosInstance;

  constructor(axiosInstance: AxiosInstance) {
    this.axiosInstance = axiosInstance;
  }

  protected async get<T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    const start = Date.now();
    try {
      const response = await this.axiosInstance.get<T>(url, config);
      const duration = Date.now() - start;
      logger.logApiCall(url, 'GET', response.status, duration);
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        const duration = Date.now() - start;
        logger.logApiCall(url, 'GET', error?.response?.status, duration);
      } else {
        logger.error('Error getting', error as Error);
      }
      throw error;
    }
  }

  protected async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    const start = Date.now();
    const timeout = config?.timeout || this.axiosInstance.defaults.timeout;

    try {
      const response = await this.axiosInstance.post<T>(url, data, config);
      const duration = Date.now() - start;
      logger.logApiCall(url, 'POST', response.status, duration);
      return response;
    } catch (error) {
      const duration = Date.now() - start;

      if (error instanceof AxiosError) {
        if (
          error.code === 'ECONNABORTED' ||
          error.message?.includes('timeout')
        ) {
          logger.error('Request timeout', error, {
            url,
            duration,
            timeout,
          });
          logger.logApiCall(url, 'POST', 408, duration);
        } else {
          logger.logApiCall(url, 'POST', error?.response?.status, duration);
        }
      } else {
        logger.error('Error posting', error as Error);
      }

      throw error;
    }
  }

  protected async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    const start = Date.now();
    try {
      const response = await this.axiosInstance.put<T>(url, data, config);
      const duration = Date.now() - start;
      logger.logApiCall(url, 'PUT', response.status, duration);
      return response;
    } catch (error) {
      const duration = Date.now() - start;

      if (error instanceof AxiosError) {
        logger.logApiCall(url, 'PUT', error?.response?.status, duration);
      } else {
        logger.error('Error putting', error as Error);
      }

      throw error;
    }
  }

  protected async patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    const start = Date.now();
    try {
      const response = await this.axiosInstance.patch<T>(url, data, config);
      const duration = Date.now() - start;
      logger.logApiCall(url, 'PATCH', response.status, duration);
      return response;
    } catch (error) {
      const duration = Date.now() - start;

      if (error instanceof AxiosError) {
        logger.logApiCall(url, 'PATCH', error?.response?.status, duration);
      } else {
        logger.error('Error patching', error as Error);
      }

      throw error;
    }
  }

  protected async delete<T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    const start = Date.now();
    try {
      const response = await this.axiosInstance.delete<T>(url, config);
      const duration = Date.now() - start;
      logger.logApiCall(url, 'DELETE', response.status, duration);
      return response;
    } catch (error) {
      const duration = Date.now() - start;

      if (error instanceof AxiosError) {
        logger.logApiCall(url, 'DELETE', error?.response?.status, duration);
      } else {
        logger.error('Error deleting', error as Error);
      }

      throw error;
    }
  }
}
