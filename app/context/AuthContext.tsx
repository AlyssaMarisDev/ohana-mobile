import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import tokenManager from "../utils/tokenManager";
import {
  login as apiLogin,
  register as apiRegister,
} from "../services/authService";
import { useGlobalState } from "./GlobalStateContext";
import { useQueryClient } from "@tanstack/react-query";

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  memberId: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [memberId, setMemberId] = useState<string | null>(null);
  const { clearAllState } = useGlobalState();
  const queryClient = useQueryClient();

  // Check authentication status on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const extractMemberIdFromToken = async (): Promise<string | null> => {
    try {
      const token = await tokenManager.getValidAccessToken();
      if (!token) return null;

      const decoded = tokenManager.decodeToken(token);
      return decoded?.userId || null;
    } catch (error) {
      console.error("Error extracting member ID from token:", error);
      return null;
    }
  };

  const checkAuthStatus = async () => {
    try {
      const token = await tokenManager.getValidAccessToken();
      const isAuth = !!token;
      setIsAuthenticated(isAuth);

      if (isAuth) {
        const userId = await extractMemberIdFromToken();
        setMemberId(userId);
      } else {
        setMemberId(null);
        clearAllState();
        // Clear React Query cache
        queryClient.clear();
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsAuthenticated(false);
      setMemberId(null);
      clearAllState();
      // Clear React Query cache
      queryClient.clear();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const authData = await apiLogin(email, password);
      // Store tokens automatically
      await tokenManager.storeTokens(
        authData.accessToken,
        authData.refreshToken
      );

      // Extract member ID from the new token
      const userId = await extractMemberIdFromToken();
      setMemberId(userId);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const authData = await apiRegister(name, email, password);
      // Store tokens automatically
      await tokenManager.storeTokens(
        authData.accessToken,
        authData.refreshToken
      );

      // Extract member ID from the new token
      const userId = await extractMemberIdFromToken();
      setMemberId(userId);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await tokenManager.clearTokens();
      setIsAuthenticated(false);
      setMemberId(null);
      clearAllState();
      // Clear React Query cache
      queryClient.clear();
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails, clear local state
      setIsAuthenticated(false);
      setMemberId(null);
      clearAllState();
      // Clear React Query cache
      queryClient.clear();
    }
  };

  const getAccessToken = async (): Promise<string | null> => {
    return await tokenManager.getValidAccessToken();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        memberId,
        login,
        register,
        logout,
        getAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
