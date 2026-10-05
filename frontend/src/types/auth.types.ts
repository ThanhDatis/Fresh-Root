import type { ApiResponse } from './api.types';

export interface Employee {
  id: string;
  employeeCode: string;
  fullName: string;
  username: string;
  email?: string;
  phone?: string;
  avatar?: string;
  role: 'admin' | 'cashier';
  employmentStatus: 'active' | 'resigned';
  startDate?: string;
  baseSalary?: number;
  createdAt: string;
  updatedAt: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthData {
  user: Employee;
  accessToken: string;
}

export type AuthResponse = ApiResponse<AuthData>;
