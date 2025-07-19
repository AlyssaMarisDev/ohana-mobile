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

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const authenticated = await tokenManager.isAuthenticated();
      setIsAuthenticated(authenticated);
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsAuthenticated(false);
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
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails, clear local state
      setIsAuthenticated(false);
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
