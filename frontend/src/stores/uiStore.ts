import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastState {
  message: string;
  type: ToastType;
  open: boolean;
}

interface UIStore {
  toast: ToastState;
  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;
}

const initialToastState: ToastState = {
  message: '',
  type: 'info',
  open: false,
};

export const useUIStore = create<UIStore>((set) => ({
  toast: initialToastState,

  showToast: (message, type: ToastType = 'info') =>
    set({ toast: { message, type, open: true } }),

  hideToast: () => set((state) => ({ toast: { ...state.toast, open: false } })),
}));
