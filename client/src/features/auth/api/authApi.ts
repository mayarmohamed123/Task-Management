import { api } from '../../../lib/api.js';
import { User, ApiResponse } from '../../../types/index.js';
import { RegisterFormValues, LoginFormValues } from '../schemas/authSchema.js';

export interface AuthResponseData {
  user: User;
  token: string;
}

export const registerApi = async (data: RegisterFormValues): Promise<AuthResponseData> => {
  const response = await api.post<ApiResponse<AuthResponseData>>('/auth/register', data);
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Registration failed');
  }
  return response.data.data;
};

export const loginApi = async (data: LoginFormValues): Promise<AuthResponseData> => {
  const response = await api.post<ApiResponse<AuthResponseData>>('/auth/login', data);
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Login failed');
  }
  return response.data.data;
};

export const getMeApi = async (): Promise<User> => {
  const response = await api.get<ApiResponse<{ user: User }>>('/auth/me');
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Failed to fetch user');
  }
  return response.data.data.user;
};
