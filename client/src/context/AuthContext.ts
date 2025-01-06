import { create } from 'zustand';

interface AuthState {
  user: User | null;
  setAuth: (user: User) => void;
}

interface User {
  id: string;
  name: string;
  email: string;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  setAuth: (user: User) =>
    set((state) => ({
      ...state,
      user,
    })),
}));
