import { create } from 'zustand';

interface User {
    name: string;
    email: string;
    role: 'ADMIN' | 'USER';
}

interface AuthState {
    user: User | null;
    setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
}));