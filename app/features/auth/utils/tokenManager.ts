import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { authService } from '../services/AuthService';
import { logger } from '@/app/common/utils/logger';

interface JWTPayload {
  exp: number;
  iat: number;
  userId: string;
  tokenType: string;
  aud: string;
  iss: string;
}

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  id?: string; // Only present in register response
}

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export class TokenManager {
  private static instance: TokenManager;
  private refreshPromise: Promise<TokenResponse> | null = null;

  private constructor() {}

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  // Get valid access token (refresh if needed)
  async getValidAccessToken(): Promise<string | null> {
    const { accessToken, refreshToken } = await this.getTokens();

    if (!accessToken || !refreshToken) {
      logger.info('No access token or refresh token found');
      return null;
    }

    if (!this.isTokenExpired(accessToken)) {
      return accessToken;
    }

    // If refresh token is expired, user needs to login again
    if (this.isTokenExpired(refreshToken)) {
      await this.clearTokens();
      logger.info('Refresh token is expired');
      return null;
    }

    // Refresh the access token
    try {
      logger.info('Refreshing access token');
      const newTokens = await this.refreshAccessToken(refreshToken);
      logger.info('New tokens', newTokens);
      return newTokens.accessToken;
    } catch (error) {
      logger.error('Error refreshing access token:', error as Error);
      // Only clear tokens if the error is a 401 (Unauthorized)
      if (error?.response?.status === 401) {
        await this.clearTokens();
        logger.info('Cleared tokens due to 401 during refresh');
      }
      // For other errors (network/server), do not clear tokens
      return null;
    }
  }

  // Decode JWT token
  decodeToken(token: string): JWTPayload | null {
    try {
      const decoded = jwtDecode(token);
      return decoded as JWTPayload;
    } catch (error) {
      logger.error('Error decoding token:', error as Error);
      return null;
    }
  }

  // Store tokens in AsyncStorage
  async storeTokens(accessToken: string, refreshToken: string): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken),
        AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken),
      ]);
    } catch (error) {
      logger.error('Error storing tokens:', error as Error);
      throw error;
    }
  }

  // Get stored tokens
  private async getTokens(): Promise<{
    accessToken: string | null;
    refreshToken: string | null;
  }> {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        AsyncStorage.getItem(ACCESS_TOKEN_KEY),
        AsyncStorage.getItem(REFRESH_TOKEN_KEY),
      ]);
      return { accessToken, refreshToken };
    } catch (error) {
      logger.error('Error getting tokens:', error as Error);
      return { accessToken: null, refreshToken: null };
    }
  }

  // Clear stored tokens
  async clearTokens(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(ACCESS_TOKEN_KEY),
        AsyncStorage.removeItem(REFRESH_TOKEN_KEY),
      ]);
    } catch (error) {
      logger.error('Error clearing tokens:', error as Error);
      throw error;
    }
  }

  // Check if token is expired
  private isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp <= currentTime;
  }

  // Refresh access token using refresh token
  private async refreshAccessToken(
    refreshToken: string
  ): Promise<TokenResponse> {
    // Prevent multiple simultaneous refresh requests
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.performRefresh(refreshToken);

    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async performRefresh(refreshToken: string): Promise<TokenResponse> {
    try {
      const tokens = await authService.refresh(refreshToken);

      // Store the new tokens
      await this.storeTokens(tokens.accessToken, tokens.refreshToken);

      return tokens;
    } catch (error) {
      logger.error('Error performing token refresh:', error as Error);
      throw error;
    }
  }
}

export default TokenManager.getInstance();
