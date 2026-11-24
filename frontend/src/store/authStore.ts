import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    axiosInstance,
    setSessionInvalidatedHandler,
} from '@/shared/api/axiosInstance';

export type Role = 'user' | 'admin';

export interface UserPublic {
    id: number;
    username: string;
    full_name: string;
    email: string;
    role: Role;
    disabled: boolean;
    created_at: string;
}

export interface RegisterInput {
    username: string;
    full_name: string;
    email: string;
    password: string;
}

interface AuthState {
    usuario: UserPublic | null;
    cargando: boolean;
    login: (username: string, password: string) => Promise<UserPublic>;
    register: (data: RegisterInput) => Promise<UserPublic>;
    logout: () => Promise<void>;
    checkSession: () => Promise<void>;
    clearSession: () => void;
    hasRole: (role: Role) => boolean;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            usuario: null,
            cargando: true,

            login: async (username: string, password: string) => {
                const formData = new URLSearchParams();
                formData.append('username', username.trim());
                formData.append('password', password);

                await axiosInstance.post('/auth/token', formData, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                });

                const { data } = await axiosInstance.get<UserPublic>('/auth/me');
                set({ usuario: data, cargando: false });
                return data;
            },

            register: async (payload: RegisterInput) => {
                const { data } = await axiosInstance.post<UserPublic>(
                    '/auth/register',
                    payload
                );
                return data;
            },

            logout: async () => {
                try {
                    await axiosInstance.post('/auth/logout');
                } finally {
                    set({ usuario: null, cargando: false });
                }
            },

            checkSession: async () => {
                set({ cargando: true });
                try {
                    const { data } = await axiosInstance.get<UserPublic>('/auth/me');
                    set({ usuario: data, cargando: false });
                } catch {
                    set({ usuario: null, cargando: false });
                }
            },

            clearSession: () => {
                set({ usuario: null, cargando: false });
            },

            hasRole: (role: Role) => {
                return get().usuario?.role === role;
            },
        }),
        {
            name: 'foodstore-auth-storage',
            partialize: (state) => ({ usuario: state.usuario }),
        }
    )
);

setSessionInvalidatedHandler(() => {
    useAuthStore.getState().clearSession();
});