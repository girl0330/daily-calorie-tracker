import type { User } from '@supabase/supabase-js';
import { create } from 'zustand';

type AuthState = {
  user: User | null;
  isAuthLoading: boolean;
  isPasswordRecovery: boolean;

  setUser: (user: User | null) => void;
  setIsAuthLoading: (isAuthLoading: boolean) => void;
  setIsPasswordRecovery: (isPasswordRecovery: boolean) => void;
  clearUser: () => void;
};

export const useAuthStore = create<AuthState>()(set => ({
  user: null,
  isAuthLoading: true,
  isPasswordRecovery: false,

  setUser: (user: User | null) => {
    set({
      user: user,
    });
  },
  setIsAuthLoading: (isLoading: boolean) => set({ isAuthLoading: isLoading }),

  setIsPasswordRecovery: (isPasswordRecovery: boolean) => {
    set({
      isPasswordRecovery: isPasswordRecovery,
    });
  },

  clearUser: () => set({ user: null, isPasswordRecovery: false }),
}));
