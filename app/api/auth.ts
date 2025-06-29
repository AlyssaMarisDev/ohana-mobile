import axios from "axios";

const API_URL = "http://10.0.2.2:4242/api/v1";

export const login = async (
  email: string,
  password: string
): Promise<string> => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data.token;
};

export const register = async (
  name: string,
  email: string,
  password: string
): Promise<string> => {
  const response = await axios.post(`${API_URL}/register`, {
    name,
    email,
    password,
  });
  return response.data.token;
};
