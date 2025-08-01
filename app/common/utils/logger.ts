/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { logger as RNLogger } from 'react-native-logs';

class EnhancedLogger {
  private baseLogger = RNLogger.createLogger({
    severity: __DEV__ ? 'debug' : 'error',
    transport: props => console.log(props.msg),
    async: true,
    dateFormat: 'time',
    printLevel: true,
    printDate: true,
    enabled: true,
  });

  debug(message: string, data?: any | unknown): void {
    if (data) {
      this.baseLogger.debug(message, data);
    } else {
      this.baseLogger.debug(message);
    }
  }

  info(message: string, data?: any | unknown): void {
    if (data) {
      this.baseLogger.info(message, data);
    } else {
      this.baseLogger.info(message);
    }
  }

  warn(message: string, data?: any | unknown, error?: Error): void {
    const logData = {
      ...data,
      error: error
        ? {
            message: error.message,
            stack: error.stack,
          }
        : undefined,
    };

    this.baseLogger.warn(message, logData);
  }

  error(message: string, error?: Error, data?: any | unknown): void {
    const logData = {
      ...data,
      error: error
        ? {
            message: error.message,
            stack: error.stack,
          }
        : undefined,
    };

    this.baseLogger.error(message, logData);
  }

  logApiCall(
    endpoint: string,
    method: string,
    status?: number,
    duration?: number
  ): void {
    this.info('API Call', {
      endpoint,
      method,
      status,
      duration: duration ? `${duration}ms` : undefined,
    });
  }
}

export const logger = new EnhancedLogger();
