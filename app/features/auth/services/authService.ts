import { API_CONFIG } from '@/app/common/config/constants';
import { BaseService } from '@/app/common/utils/BaseService';
import axios from 'axios';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  id?: string; // Only present in register response
}

export class AuthService extends BaseService {
  constructor() {
    const axiosInstance = axios.create({
      baseURL: API_CONFIG.FULL_URL,
      timeout: 5000,
    });

    super(axiosInstance);
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.post('/login', {
      email,
      password,
    });
    return response.data;
  }

  async register(
    name: string,
    email: string,
    password: string
  ): Promise<AuthResponse> {
    const response = await this.post('/register', {
      name,
      email,
      password,
    });
    return response.data;
  }

  async refresh(refreshToken: string): Promise<AuthResponse> {
    const response = await this.post('/refresh', {
      refreshToken,
    });
    return response.data;
  }
}

export const authService = new AuthService();
