import type { ApiResponse } from './api.types';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'customer' | 'admin';
  authProvider: 'local' | 'google';
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthData {
  user: User;
  accessToken: string;
}

export type AuthResponse = ApiResponse<AuthData>;
