# Authentication Token Management

This document explains how the authentication token management system works in the Ohana Mobile app.

## Overview

The app now uses a dual-token authentication system with automatic token refresh:

- **Access Token**: Short-lived token (typically 1 hour) used for API requests
- **Refresh Token**: Long-lived token (typically 30 days) used to get new access tokens

## Key Features

1. **Automatic Token Storage**: Tokens are automatically stored in AsyncStorage when logging in or registering
2. **Automatic Token Refresh**: Access tokens are automatically refreshed when they're within 5 minutes of expiring
3. **Seamless API Calls**: All authenticated API calls automatically include the current access token
4. **Automatic Retry**: Failed requests due to expired tokens are automatically retried with a fresh token

## Components

### TokenManager (`app/utils/tokenManager.ts`)

The core token management utility that handles:

- Token storage and retrieval
- JWT token decoding and validation
- Automatic token refresh logic
- Token expiration checking

### AuthContext (`app/context/AuthContext.tsx`)

React context that provides authentication state and methods:

- `isAuthenticated`: Boolean indicating if user is logged in
- `isLoading`: Boolean indicating if auth status is being checked
- `login(email, password)`: Login function
- `register(name, email, password)`: Registration function
- `logout()`: Logout function
- `getAccessToken()`: Get current valid access token

### Auth Service (`app/services/authService.ts`)

Pure HTTP API functions for authentication:

- `login(email, password)`: Login API call (returns tokens)
- `register(name, email, password)`: Register API call (returns tokens)
- `refresh(refreshToken)`: Refresh token API call (returns new tokens)

### Auth Context (`app/context/AuthContext.tsx`)

React context that handles authentication state and token management:

- `isAuthenticated`: Boolean indicating if user is logged in
- `isLoading`: Boolean indicating if auth status is being checked
- `login(email, password)`: Login function (handles API call + token storage)
- `register(name, email, password)`: Registration function (handles API call + token storage)
- `logout()`: Logout function (clears stored tokens)
- `getAccessToken()`: Get current valid access token

### Authenticated Axios (`app/utils/authenticatedAxios.ts`)

HTTP client with automatic token handling:

- `createAuthenticatedAxios()`: Create axios instance with automatic token handling

## Usage Examples

### Basic Authentication

```typescript
import { useAuth } from "../context/AuthContext";

function MyComponent() {
  const { isAuthenticated, login, logout } = useAuth();

  const handleLogin = async () => {
    try {
      await login("user@example.com", "password");
      // User is now authenticated
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    await logout();
    // User is now logged out
  };

  return (
    <div>
      {isAuthenticated ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

### Making Authenticated API Calls

```typescript
import { apiClient } from '../utils/apiClient';

// The apiClient automatically includes the access token and handles refresh
const getUserData = async () => {
  try {
    const response = await apiClient.get('/user/profile');
    return response.data;
  } catch (error) {
    console.error('API call failed:', error);
  }
};

// Or use the example functions
import { exampleApiCalls } from '../utils/apiClient';

const getTasks = async () => {
  try {
    const tasks = await exampleApiCalls.getTasks();
    return tasks;
  } catch (error) {
    console.error('Failed to get tasks:', error);
  }
};
```

### Manual Token Access

```typescript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { getAccessToken } = useAuth();

  const makeCustomRequest = async () => {
    const token = await getAccessToken();
    if (token) {
      // Use token for custom requests
      const response = await fetch('/api/endpoint', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    }
  };
}
```

## Token Refresh Logic

1. **Preemptive Refresh**: Tokens are refreshed when they're within 5 minutes of expiring
2. **Automatic Retry**: If an API call fails with 401, the system automatically:
   - Refreshes the access token
   - Retries the original request
   - If refresh fails, logs the user out
3. **Concurrent Requests**: Multiple simultaneous requests won't trigger multiple refresh calls

## Error Handling

- **Network Errors**: Handled gracefully with user-friendly error messages
- **Token Expiration**: Automatically handled by the system
- **Refresh Token Expired**: User is automatically logged out and redirected to login
- **API Errors**: Proper error messages are displayed to users

## Security Features

- Tokens are stored securely in AsyncStorage
- Access tokens have short lifespans (1 hour)
- Refresh tokens have longer lifespans but are still time-limited
- Automatic logout on refresh token expiration
- No tokens are logged or exposed in console

## Backend Integration

The system expects the backend to provide:

1. **Login Response**:

```json
{
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token"
}
```

2. **Register Response**:

```json
{
  "id": "user_id",
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token"
}
```

3. **Refresh Endpoint** (`POST /api/v1/refresh`):

```json
{
  "refreshToken": "jwt_refresh_token"
}
```

Response:

```json
{
  "accessToken": "new_jwt_access_token",
  "refreshToken": "new_jwt_refresh_token"
}
```

## Testing

To test the token refresh functionality:

1. Login to the app
2. Wait for the access token to be close to expiration (or modify the refresh threshold)
3. Make an API call - the token should automatically refresh
4. Check the network tab to see the refresh request

The system is designed to be transparent to the user - they shouldn't notice when tokens are being refreshed.
