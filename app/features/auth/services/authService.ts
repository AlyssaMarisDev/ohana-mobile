import { BaseService } from '@/app/common/utils/BaseService';
import baseAxios from '@/app/common/utils/baseAxios';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  id?: string; // Only present in register response
}

export class AuthService extends BaseService {
  constructor() {
    super(baseAxios);
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
