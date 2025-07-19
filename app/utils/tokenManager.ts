import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { refresh as apiRefresh } from "../services/authService";

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

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const REFRESH_THRESHOLD_MINUTES = 5; // Refresh token if it expires within 5 minutes

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

  // Store tokens in AsyncStorage
  async storeTokens(accessToken: string, refreshToken: string): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken),
        AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken),
      ]);
    } catch (error) {
      console.error("Error storing tokens:", error);
      throw error;
    }
  }

  // Get stored tokens
  async getTokens(): Promise<{
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
      console.error("Error getting tokens:", error);
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
      console.error("Error clearing tokens:", error);
      throw error;
    }
  }

  // Decode JWT token
  decodeToken(token: string): JWTPayload | null {
    try {
      const decoded = jwtDecode(token);
      return decoded as JWTPayload;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }

  // Check if token is expired
  isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp <= currentTime;
  }

  // Check if user is authenticated (has valid tokens)
  async isAuthenticated(): Promise<boolean> {
    const { accessToken, refreshToken } = await this.getTokens();
    return !!(accessToken && refreshToken && !this.isTokenExpired(accessToken));
  }

  // Get valid access token (refresh if needed)
  async getValidAccessToken(): Promise<string | null> {
    const { accessToken, refreshToken } = await this.getTokens();

    if (!accessToken || !refreshToken) {
      return null;
    }

    // If refresh token is expired, user needs to login again
    if (this.isTokenExpired(refreshToken)) {
      await this.clearTokens();
      return null;
    }

    // Refresh the access token
    try {
      const newTokens = await this.refreshAccessToken(refreshToken);
      return newTokens.accessToken;
    } catch (error) {
      console.error("Error refreshing access token:", error);
      await this.clearTokens();
      return null;
    }
  }

  // Refresh access token using refresh token
  async refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
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
      const tokens = await apiRefresh(refreshToken);

      // Store the new tokens
      await this.storeTokens(tokens.accessToken, tokens.refreshToken);

      return tokens;
    } catch (error) {
      console.error("Error performing token refresh:", error);
      throw error;
    }
  }
}

export default TokenManager.getInstance();
