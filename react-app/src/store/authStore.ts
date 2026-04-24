import type { User } from '@supabase/supabase-js';
import { create } from 'zustand';

type AuthState = {
  user: User | null;
  isAuthLoading: boolean;

  setUser: (user: User | null) => void;
  setIsAuthLoading: (isAuthLoading: boolean) => void;
  clearUser: () => void;
};

export const useAuthStore = create<AuthState>()(set => ({
  user: null,
  isAuthLoading: true,

  setUser: (user: User | null) => {
    set({
      user: user,
    });
  },
  setIsAuthLoading: (isLoading: boolean) => set({ isAuthLoading: isLoading }),
  clearUser: () => set({ user: null }),
}));
