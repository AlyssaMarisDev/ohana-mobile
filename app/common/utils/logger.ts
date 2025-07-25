import { logger as RNLogger } from 'react-native-logs';
import { shouldEnableCrashReporting } from '../config/environment';

// Create the logger instance with default configuration
export const logger = RNLogger.createLogger({
  severity: __DEV__ ? 'debug' : 'error',
  transport: props => console.log(props.msg),
  async: true,
  dateFormat: 'time',
  printLevel: true,
  printDate: true,
  enabled: true,
});

// Export log levels for convenience
export const LogLevel = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
} as const;

// Enhanced logger with additional features
export class EnhancedLogger {
  private logger = logger;

  debug(message: string, data?: any): void {
    if (data) {
      this.logger.debug(message, data);
    } else {
      this.logger.debug(message);
    }
  }

  info(message: string, data?: any): void {
    if (data) {
      this.logger.info(message, data);
    } else {
      this.logger.info(message);
    }
  }

  warn(message: string, data?: any, error?: Error): void {
    const logData = {
      ...data,
      error: error
        ? {
            message: error.message,
            stack: error.stack,
          }
        : undefined,
    };

    this.logger.warn(message, logData);
  }

  error(message: string, error?: Error, data?: any): void {
    const logData = {
      ...data,
      error: error
        ? {
            message: error.message,
            stack: error.stack,
          }
        : undefined,
    };

    this.logger.error(message, logData);

    // Send to crash reporting if enabled
    if (shouldEnableCrashReporting()) {
      this.reportError(message, error, data);
    }
  }

  private reportError(message: string, error?: Error, data?: any): void {
    // TODO: Implement crash reporting service integration
    // Examples: Sentry, Crashlytics, etc.
    console.log('Would send to crash reporting service:', {
      message,
      error: error?.message,
      stack: error?.stack,
      data,
    });
  }

  // Convenience methods for common logging patterns
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

  logUserAction(action: string, data?: any): void {
    this.info('User Action', {
      action,
      ...data,
    });
  }

  logPerformance(operation: string, duration: number): void {
    this.info('Performance', {
      operation,
      duration: `${duration}ms`,
    });
  }

  logNavigation(from: string, to: string): void {
    this.debug('Navigation', {
      from,
      to,
    });
  }
}

// Export the enhanced logger instance
export const enhancedLogger = new EnhancedLogger();

// Export the base logger for direct access
export { logger as baseLogger };
