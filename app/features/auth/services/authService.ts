import axios from "axios";
import { API_CONFIG } from "../../../common/config/constants";

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  id?: string; // Only present in register response
}

export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await axios.post(`${API_CONFIG.FULL_URL}/login`, {
    email,
    password,
  });
  return response.data;
};

export const register = async (
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await axios.post(`${API_CONFIG.FULL_URL}/register`, {
    name,
    email,
    password,
  });
  return response.data;
};

export const refresh = async (refreshToken: string): Promise<AuthResponse> => {
  const response = await axios.post(`${API_CONFIG.FULL_URL}/refresh`, {
    refreshToken,
  });
  return response.data;
};
