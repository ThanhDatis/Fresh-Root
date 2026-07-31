import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { getAuthCookie } from '@/lib/cookie';
import { useAuthStore } from '@/stores/authStore';
import type { ApiResponse } from '@/types/api.types';

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

function createAxiosInstance(baseURL?: string) {
  const instance = axios.create({
    baseURL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
  });

  instance.interceptors.request.use((config) => {
    const token = getAuthCookie();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as
        | RetryableRequestConfig
        | undefined;

      const isRefreshCall = originalRequest?.url?.includes(
        '/auth/refresh-token',
      );

      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry &&
        !isRefreshCall
      ) {
        originalRequest._retry = true;

        try {
          const { data } = await instance.post<
            ApiResponse<{ accessToken: string }>
          >('/auth/refresh-token');
          const newToken = data.data.accessToken;

          useAuthStore.getState().setAccessToken(newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          return instance(originalRequest);
        } catch (refreshError) {
          useAuthStore.getState().logout();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    },
  );

  return instance;
}

export const authApi = createAxiosInstance(
  process.env.NEXT_PUBLIC_AUTH_API_URL,
);
