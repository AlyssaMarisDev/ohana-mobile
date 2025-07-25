import { enhancedLogger } from './logger';
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export class BaseService {
  protected axiosInstance: AxiosInstance;

  constructor(axiosInstance: AxiosInstance) {
    this.axiosInstance = axiosInstance;
  }

  protected async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    const start = Date.now();
    try {
      const response = await this.axiosInstance.get<T>(url, config);
      const duration = Date.now() - start;
      enhancedLogger.logApiCall(url, 'GET', response.status, duration);
      return response;
    } catch (error: any) {
      const duration = Date.now() - start;
      enhancedLogger.logApiCall(url, 'GET', error?.response?.status, duration);
      throw error;
    }
  }

  protected async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    const start = Date.now();
    const timeout = config?.timeout || this.axiosInstance.defaults.timeout;

    try {
      const response = await this.axiosInstance.post<T>(url, data, config);
      enhancedLogger.info('Response', response);
      const duration = Date.now() - start;
      enhancedLogger.logApiCall(url, 'POST', response.status, duration);
      return response;
    } catch (error: any) {
      const duration = Date.now() - start;

      // Handle timeout errors specifically
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        enhancedLogger.error('Request timeout', error, {
          url,
          duration,
          timeout,
        });
        enhancedLogger.logApiCall(url, 'POST', 408, duration);
      } else {
        enhancedLogger.logApiCall(
          url,
          'POST',
          error?.response?.status,
          duration
        );
      }

      throw error;
    }
  }

  protected async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    const start = Date.now();
    try {
      const response = await this.axiosInstance.put<T>(url, data, config);
      const duration = Date.now() - start;
      enhancedLogger.logApiCall(url, 'PUT', response.status, duration);
      return response;
    } catch (error: any) {
      const duration = Date.now() - start;
      enhancedLogger.logApiCall(url, 'PUT', error?.response?.status, duration);
      throw error;
    }
  }

  protected async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    const start = Date.now();
    try {
      const response = await this.axiosInstance.patch<T>(url, data, config);
      const duration = Date.now() - start;
      enhancedLogger.logApiCall(url, 'PATCH', response.status, duration);
      return response;
    } catch (error: any) {
      const duration = Date.now() - start;
      enhancedLogger.logApiCall(
        url,
        'PATCH',
        error?.response?.status,
        duration
      );
      throw error;
    }
  }

  protected async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    const start = Date.now();
    try {
      const response = await this.axiosInstance.delete<T>(url, config);
      const duration = Date.now() - start;
      enhancedLogger.logApiCall(url, 'DELETE', response.status, duration);
      return response;
    } catch (error: any) {
      const duration = Date.now() - start;
      enhancedLogger.logApiCall(
        url,
        'DELETE',
        error?.response?.status,
        duration
      );
      throw error;
    }
  }
}
