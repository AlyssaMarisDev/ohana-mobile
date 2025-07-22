import baseAxios from '../utils/baseAxios';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  id?: string; // Only present in register response
}

export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await baseAxios.post(`/login`, {
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
  const response = await baseAxios.post(`/register`, {
    name,
    email,
    password,
  });
  return response.data;
};

export const refresh = async (refreshToken: string): Promise<AuthResponse> => {
  const response = await baseAxios.post(`/refresh`, {
    refreshToken,
  });
  return response.data;
};
