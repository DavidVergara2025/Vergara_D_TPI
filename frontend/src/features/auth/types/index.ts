import type {
    RegisterInput,
    Role,
    UserPublic,
} from '@/store/authStore';

export type { UserPublic, Role, RegisterInput };
export type UsuarioAuth = UserPublic;
export type User = UserPublic;

export interface LoginCredentials {
    username: string;
    password: string;
}