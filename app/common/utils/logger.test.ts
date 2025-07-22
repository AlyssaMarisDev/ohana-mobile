import { enhancedLogger, LogLevel } from './logger';

describe('Enhanced Logger', () => {
  describe('logger interface', () => {
    it('should have all required methods', () => {
      expect(typeof enhancedLogger.debug).toBe('function');
      expect(typeof enhancedLogger.info).toBe('function');
      expect(typeof enhancedLogger.warn).toBe('function');
      expect(typeof enhancedLogger.error).toBe('function');
    });

    it('should have convenience methods', () => {
      expect(typeof enhancedLogger.logApiCall).toBe('function');
      expect(typeof enhancedLogger.logUserAction).toBe('function');
      expect(typeof enhancedLogger.logPerformance).toBe('function');
      expect(typeof enhancedLogger.logNavigation).toBe('function');
    });
  });

  describe('method calls', () => {
    it('should call debug without throwing', () => {
      expect(() => {
        enhancedLogger.debug('Test debug message', { test: 'data' });
      }).not.toThrow();
    });

    it('should call info without throwing', () => {
      expect(() => {
        enhancedLogger.info('Test info message');
      }).not.toThrow();
    });

    it('should call warn without throwing', () => {
      const error = new Error('Test error');
      expect(() => {
        enhancedLogger.warn('Test warning message', { test: 'data' }, error);
      }).not.toThrow();
    });

    it('should call error without throwing', () => {
      const error = new Error('Test error');
      expect(() => {
        enhancedLogger.error('Test error message', error, { test: 'data' });
      }).not.toThrow();
    });
  });

  describe('convenience methods', () => {
    it('should call logApiCall without throwing', () => {
      expect(() => {
        enhancedLogger.logApiCall('/api/users', 'GET', 200, 150);
      }).not.toThrow();
    });

    it('should call logUserAction without throwing', () => {
      expect(() => {
        enhancedLogger.logUserAction('button_click', { buttonId: 'submit' });
      }).not.toThrow();
    });

    it('should call logPerformance without throwing', () => {
      expect(() => {
        enhancedLogger.logPerformance('data_loading', 250);
      }).not.toThrow();
    });

    it('should call logNavigation without throwing', () => {
      expect(() => {
        enhancedLogger.logNavigation('Home', 'Profile');
      }).not.toThrow();
    });
  });

  describe('LogLevel constants', () => {
    it('should have correct log level values', () => {
      expect(LogLevel.DEBUG).toBe('debug');
      expect(LogLevel.INFO).toBe('info');
      expect(LogLevel.WARN).toBe('warn');
      expect(LogLevel.ERROR).toBe('error');
    });
  });
});
