import type { ApiResponse } from '@/types/api.types';
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from '@/types/auth.types';

import { authApi } from './axiosInstances';

export async function loginApi(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await authApi.post<AuthResponse>('/auth/login', payload);
  return data;
}

export async function registerApi(
  payload: RegisterPayload,
): Promise<AuthResponse> {
  const { data } = await authApi.post<AuthResponse>('/auth/register', payload);
  return data;
}

export async function refreshTokenApi(): Promise<
  ApiResponse<{ accessToken: string }>
> {
  const { data } = await authApi.post<ApiResponse<{ accessToken: string }>>(
    '/auth/refresh-token',
  );
  return data;
}

export async function logoutApi(): Promise<void> {
  await authApi.post('/auth/logout');
}
