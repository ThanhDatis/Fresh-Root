import { create } from 'zustand';

import { getAuthCookie, removeAuthCookie, setAuthCookie } from '@/lib/cookie';
import type { User } from '@/types/auth.types';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  setAccessToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: getAuthCookie() ?? null,
  isAuthenticated: Boolean(getAuthCookie()),

  login: (user, token) => {
    setAuthCookie(token);
    set({ user, token, isAuthenticated: true });
  },

  setAccessToken: (token) => {
    setAuthCookie(token);
    set({ token, isAuthenticated: true });
  },

  logout: () => {
    removeAuthCookie();
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
