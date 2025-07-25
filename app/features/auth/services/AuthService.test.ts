import { AuthService } from './AuthService';
import { AxiosResponse } from 'axios';

jest.mock('@/app/common/utils/BaseService');

const mockPost = jest.fn();

// Mock BaseService to use our mockPost
jest.mock('@/app/common/utils/BaseService', () => {
  return {
    BaseService: jest.fn().mockImplementation(() => ({
      post: mockPost,
    })),
  };
});

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    const { AuthService: AuthService } = jest.requireActual('./AuthService');
    authService = new AuthService();
  });

  const mockResponse = (data: any): AxiosResponse => ({
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: { headers: {} as any },
  });

  describe('login', () => {
    it('should call post with correct params and return data', async () => {
      const result = { accessToken: 'a', refreshToken: 'r', id: '1' };
      mockPost.mockResolvedValueOnce(mockResponse(result));
      const res = await authService.login('test@example.com', 'pw');
      expect(mockPost).toHaveBeenCalledWith('/login', {
        email: 'test@example.com',
        password: 'pw',
      });
      expect(res).toEqual(result);
    });
    it('should throw if post fails', async () => {
      mockPost.mockRejectedValueOnce(new Error('fail'));
      await expect(authService.login('a', 'b')).rejects.toThrow('fail');
    });
  });

  describe('register', () => {
    it('should call post with correct params and return data', async () => {
      const result = { accessToken: 'a', refreshToken: 'r', id: '2' };
      mockPost.mockResolvedValueOnce(mockResponse(result));
      const res = await authService.register('name', 'email', 'pw');
      expect(mockPost).toHaveBeenCalledWith('/register', {
        name: 'name',
        email: 'email',
        password: 'pw',
      });
      expect(res).toEqual(result);
    });
    it('should throw if post fails', async () => {
      mockPost.mockRejectedValueOnce(new Error('fail'));
      await expect(authService.register('n', 'e', 'p')).rejects.toThrow('fail');
    });
  });

  describe('refresh', () => {
    it('should call post with correct params and return data', async () => {
      const result = { accessToken: 'a', refreshToken: 'r' };
      mockPost.mockResolvedValueOnce(mockResponse(result));
      const res = await authService.refresh('refresh-token');
      expect(mockPost).toHaveBeenCalledWith('/refresh', {
        refreshToken: 'refresh-token',
      });
      expect(res).toEqual(result);
    });
    it('should throw if post fails', async () => {
      mockPost.mockRejectedValueOnce(new Error('fail'));
      await expect(authService.refresh('bad')).rejects.toThrow('fail');
    });
  });
});
