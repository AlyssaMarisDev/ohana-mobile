# Configuration System Guide

## Overview

The Ohana Mobile app uses a flexible configuration system that supports environment variables and different deployment environments (development, staging, production).

## 🏗️ Architecture

```
.env.example          # Template for environment variables
.env                  # Actual environment variables (gitignored)
├── app/common/config/
│   ├── environment.ts    # Main configuration logic
│   ├── constants.ts      # Legacy constants (now uses environment.ts)
│   └── env.d.ts          # TypeScript declarations
└── babel.config.js       # Babel config for @env support
```

## 🔧 How It Works

### 1. Environment Variables Setup

**Step 1: Create `.env` file**

```bash
# Copy the example file
cp env.example .env

# Edit .env with your actual values
API_BASE_URL=http://your-dev-api.com
PRODUCTION_API_BASE_URL=https://your-prod-api.com
ENABLE_ANALYTICS=true
```

**Step 2: Babel Configuration**
The `babel.config.js` file includes the `react-native-dotenv` plugin:

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          safe: false,
          allowUndefined: true,
        },
      ],
    ],
  };
};
```

**Step 3: TypeScript Declarations**
The `env.d.ts` file provides TypeScript support:

```typescript
declare module '@env' {
  export const API_BASE_URL: string;
  export const API_VERSION: string;
  // ... other variables
}
```

### 2. Environment Detection

The system automatically detects the current environment:

```typescript
const getEnvironment = (): Environment => {
  if (__DEV__) return 'development';

  const bundleId =
    Constants.expoConfig?.ios?.bundleIdentifier ||
    Constants.expoConfig?.android?.package;

  if (bundleId?.includes('staging')) return 'staging';
  return 'production';
};
```

- **Development**: When `__DEV__` is true (Expo development server)
- **Staging**: When bundle ID contains "staging"
- **Production**: All other cases

### 3. Configuration Resolution

The system uses a hierarchical approach for API URLs with intelligent fallbacks:

```typescript
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
```

**API URL Resolution Priority:**

1. **Environment-specific URL** (e.g., `PRODUCTION_API_BASE_URL`)
2. **Base URL** (`API_BASE_URL`)
3. **Hardcoded fallback** (e.g., `https://api.ohana.com`)

This approach allows you to:

- Use one URL for all environments (just set `API_BASE_URL`)
- Have sensible defaults for all environments

## 📝 Available Environment Variables

| Variable                 | Type    | Default                | Description                                                |
| ------------------------ | ------- | ---------------------- | ---------------------------------------------------------- |
| `API_BASE_URL`           | string  | `http://10.0.2.2:4242` | Base API URL (used for all environments unless overridden) |
| `API_VERSION`            | string  | `v1`                   | API version                                                |
| `ENABLE_ANALYTICS`       | boolean | `false`                | Enable analytics tracking                                  |
| `ENABLE_CRASH_REPORTING` | boolean | `false`                | Enable crash reporting                                     |
| `DEBUG_MODE`             | boolean | `true`                 | Enable debug logging                                       |

## 🚀 Usage Examples

### Basic Configuration Access

```typescript
import { getConfig, getApiUrl, isDevelopment } from '../config/environment';

// Get full configuration
const config = getConfig();
console.log(config.apiBaseUrl); // http://your-api.com

// Get specific values
const apiUrl = getApiUrl(); // http://your-api.com/api/v1

// Check environment
if (isDevelopment()) {
  console.log('Running in development mode');
}
```

### Using in Components

```typescript
import React from 'react';
import { getConfig, shouldEnableAnalytics } from '../config/environment';

function MyComponent() {
  const config = getConfig();

  // Use configuration values
  const apiUrl = `${config.apiBaseUrl}/api/${config.apiVersion}`;

  // Conditional features
  if (shouldEnableAnalytics()) {
    // Initialize analytics
  }

  return <Text>API: {apiUrl}</Text>;
}
```

### Using in Services

```typescript
import { getApiUrl } from '../config/environment';

export const apiService = {
  async fetchData() {
    const response = await fetch(`${getApiUrl()}/data`);
    return response.json();
  },
};
```

## 🔄 Environment-Specific Behavior

### Development Environment

- Uses `API_BASE_URL` from `.env`
- Debug mode enabled
- Analytics disabled
- Crash reporting disabled
- Detailed error messages

### Staging Environment

- Uses `API_BASE_URL` from `.env`
- Debug mode disabled
- Analytics enabled
- Crash reporting enabled
- User-friendly error messages

### Production Environment

- Uses `PRODUCTION_API_BASE_URL` from `.env`
- Debug mode disabled
- Analytics enabled
- Crash reporting enabled
- User-friendly error messages

## 🛠️ Configuration Management

### Adding New Environment Variables

1. **Add to `.env.example`:**

   ```bash
   NEW_FEATURE_FLAG=true
   ```

2. **Add to `env.d.ts`:**

   ```typescript
   declare module '@env' {
     export const NEW_FEATURE_FLAG: string;
   }
   ```

3. **Add to `environment.ts`:**

   ```typescript
   import { NEW_FEATURE_FLAG } from '@env';

   interface EnvironmentConfig {
     // ... existing properties
     newFeatureFlag: boolean;
   }

   const configs: Record<Environment, EnvironmentConfig> = {
     development: {
       // ... existing properties
       newFeatureFlag: parseBoolean(NEW_FEATURE_FLAG, false),
     },
     // ... other environments
   };
   ```

### Environment-Specific Configuration

For different environments, you can:

1. **Use different `.env` files:**

   ```bash
   .env.development
   .env.staging
   .env.production
   ```

2. **Use build-time environment detection:**

   ```typescript
   const getEnvironment = (): Environment => {
     if (__DEV__) return 'development';

     // Check bundle identifier
     const bundleId = Constants.expoConfig?.ios?.bundleIdentifier;

     if (bundleId?.includes('staging')) return 'staging';
     if (bundleId?.includes('prod')) return 'production';

     return 'production';
   };
   ```

## 🔒 Security Considerations

### Environment Variables

- Never commit `.env` files to version control
- Use `.env.example` as a template
- Validate environment variables at startup
- Use secure defaults for missing variables

### API URLs

- Use HTTPS in production
- Validate API endpoints
- Implement proper error handling
- Use environment-specific certificates

## 🧪 Testing Configuration

### Unit Tests

```typescript
import { getConfig, getApiUrl } from '../environment';

// Mock environment variables
jest.mock('@env', () => ({
  API_BASE_URL: 'http://test-api.com',
  API_VERSION: 'v2',
}));

describe('Configuration', () => {
  it('should use environment variables', () => {
    const config = getConfig();
    expect(config.apiBaseUrl).toBe('http://test-api.com');
  });
});
```

### Integration Tests

```typescript
// Test with different environments
describe('Environment Detection', () => {
  it('should detect development', () => {
    (global as any).__DEV__ = true;
    expect(isDevelopment()).toBe(true);
  });
});
```

## 🚨 Troubleshooting

### Common Issues

1. **Environment variables not loading:**
   - Check `.env` file exists
   - Restart Metro bundler
   - Clear cache: `expo start -c`

2. **TypeScript errors:**
   - Ensure `env.d.ts` is included in `tsconfig.json`
   - Check variable names match exactly

3. **Wrong environment detected:**
   - Check bundle identifier configuration
   - Verify `__DEV__` flag
   - Review environment detection logic

### Debug Configuration

```typescript
import { getConfig, getEnvironment } from '../config/environment';

// Debug current configuration
console.log('Environment:', getEnvironment());
console.log('Config:', getConfig());
console.log('API URL:', getApiUrl());
```

## 📚 Best Practices

1. **Always provide fallbacks** for environment variables
2. **Validate configuration** at app startup
3. **Use TypeScript** for type safety
4. **Test all environments** thoroughly
5. **Document configuration** changes
6. **Use secure defaults** for production
7. **Monitor configuration** usage in production

---

This configuration system provides a robust, type-safe way to manage different environments while maintaining security and flexibility.
