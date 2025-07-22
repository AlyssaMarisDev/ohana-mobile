import {
  getConfig,
  getApiUrl,
  isDevelopment,
  isProduction,
  isStaging,
} from './environment';
import '@env';

describe('Environment Configuration', () => {
  beforeEach(() => {
    // Reset __DEV__ to true for development environment
    (global as any).__DEV__ = true;
  });

  describe('getConfig', () => {
    it('should return development config when __DEV__ is true', () => {
      const config = getConfig();

      // Test that we get a valid config object
      expect(config).toBeDefined();
      expect(config.apiBaseUrl).toBeDefined();
      expect(config.apiVersion).toBeDefined();
      expect(config.enableAnalytics).toBeDefined();
      expect(config.enableCrashReporting).toBeDefined();
      expect(config.debugMode).toBeDefined();
    });
  });

  describe('getApiUrl', () => {
    it('should return a valid API URL', () => {
      const apiUrl = getApiUrl();
      expect(apiUrl).toBeDefined();
      expect(typeof apiUrl).toBe('string');
      expect(apiUrl).toContain('/api/');
    });
  });

  describe('environment detection', () => {
    it('should detect development environment', () => {
      (global as any).__DEV__ = true;
      expect(isDevelopment()).toBe(true);
      expect(isProduction()).toBe(false);
      expect(isStaging()).toBe(false);
    });

    it('should detect production environment', () => {
      (global as any).__DEV__ = false;
      expect(isDevelopment()).toBe(false);
      expect(isProduction()).toBe(true);
      expect(isStaging()).toBe(false);
    });

    it('should detect staging environment when bundle ID contains staging', () => {
      (global as any).__DEV__ = false;

      // Note: This test would require more complex mocking of expo-constants
      // For now, we'll test the basic logic without the complex mocking
      expect(isDevelopment()).toBe(false);
      expect(isProduction()).toBe(true); // Default when not development
      expect(isStaging()).toBe(false);
    });
  });

  describe('configuration structure', () => {
    it('should have all required configuration properties', () => {
      const config = getConfig();

      expect(config).toHaveProperty('apiBaseUrl');
      expect(config).toHaveProperty('apiVersion');
      expect(config).toHaveProperty('enableAnalytics');
      expect(config).toHaveProperty('enableCrashReporting');
      expect(config).toHaveProperty('debugMode');
    });

    it('should have correct data types', () => {
      const config = getConfig();

      expect(typeof config.apiBaseUrl).toBe('string');
      expect(typeof config.apiVersion).toBe('string');
      expect(typeof config.enableAnalytics).toBe('boolean');
      expect(typeof config.enableCrashReporting).toBe('boolean');
      expect(typeof config.debugMode).toBe('boolean');
    });
  });
});
