import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar_url?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User, keepLoggedIn?: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user, keepLoggedIn = false) => {
        set({ user, isAuthenticated: true });
        if (keepLoggedIn) {
          localStorage.setItem('keepLoggedIn', 'true');
        }
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
        localStorage.removeItem('keepLoggedIn');
        sessionStorage.clear();
      },
    }),
    {
      name: 'auth-storage',
      storage: {
        getItem: (name) => {
          const keepLoggedIn = localStorage.getItem('keepLoggedIn');
          const storage = keepLoggedIn ? localStorage : sessionStorage;
          const value = storage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          const keepLoggedIn = localStorage.getItem('keepLoggedIn');
          const storage = keepLoggedIn ? localStorage : sessionStorage;
          storage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
          sessionStorage.removeItem(name);
        },
      },
    }
  )
);