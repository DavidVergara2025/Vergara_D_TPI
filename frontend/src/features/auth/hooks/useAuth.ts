import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/shared/api/axiosInstance';
import { handleApiError } from '@/shared/api/handleApiError';
import { useAuthStore, type UserPublic } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';

export const useAuth = () => {
    const usuario = useAuthStore((s) => s.usuario);
    const cargando = useAuthStore((s) => s.cargando);
    const login = useAuthStore((s) => s.login);
    const register = useAuthStore((s) => s.register);
    const logout = useAuthStore((s) => s.logout);
    const checkSession = useAuthStore((s) => s.checkSession);
    const clearSession = useAuthStore((s) => s.clearSession);
    const hasRole = useAuthStore((s) => s.hasRole);

    return {
        usuario,
        user: usuario,
        isAuthenticated: usuario !== null,
        cargando,
        isLoading: cargando,
        login,
        register,
        logout,
        checkSession,
        checkAuth: checkSession,
        clearSession,
        hasRole,
    };
};

export const useAdminUsers = () => {
    const queryClient = useQueryClient();
    const showNotification = useNotificationStore((s) => s.showNotification);

    const query = useQuery({
        queryKey: ['admin-usuarios'],
        queryFn: async (): Promise<UserPublic[]> => {
            const { data } =
                await axiosInstance.get<UserPublic[]>('/admin/usuarios');
            return data;
        },
    });

    const toggleActiveMutation = useMutation({
        mutationFn: async ({
            userId,
            currentlyDisabled,
        }: {
            userId: number;
            currentlyDisabled: boolean;
        }) => {
            const endpoint = currentlyDisabled
                ? `/admin/usuarios/${userId}/activar`
                : `/admin/usuarios/${userId}/desactivar`;
            const { data } = await axiosInstance.post<UserPublic>(endpoint);
            return data;
        },
        onSuccess: (updatedUser) => {
            void queryClient.invalidateQueries({ queryKey: ['admin-usuarios'] });
            showNotification(
                updatedUser.disabled
                    ? 'Usuario desactivado exitosamente'
                    : 'Usuario activado exitosamente',
                'success'
            );
        },
        onError: (err: unknown) => {
            showNotification(
                handleApiError(err, 'Error al cambiar el estado del usuario'),
                'error'
            );
        },
    });

    return {
        users: query.data ?? [],
        isLoading: query.isLoading,
        isError: query.isError,
        refetch: query.refetch,
        toggleUserActive: (userId: number, currentlyDisabled: boolean) =>
            toggleActiveMutation.mutateAsync({ userId, currentlyDisabled }),
    };
};