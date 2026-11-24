import React from 'react';
import { ErrorState } from '@/shared/components/ErrorState';
import { LoadingState } from '@/shared/components/LoadingState';
import { UserList } from '../components/UserList';
import { useAdminUsers, useAuth } from '../hooks/useAuth';

export const AdminUsersPage: React.FC = () => {
    const { usuario } = useAuth();
    const { users, isLoading, isError, refetch, toggleUserActive } =
        useAdminUsers();

    const handleToggleActive = async (
        userId: number,
        currentlyDisabled: boolean
    ) => {
        try {
            await toggleUserActive(userId, currentlyDisabled);
        } catch {
            // La notificación de error la gestiona useAdminUsers
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    Administración de Usuarios
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Activá o desactivá cuentas de usuario.
                </p>
            </div>

            {isLoading && <LoadingState mensaje="Cargando usuarios..." />}

            {isError && (
                <ErrorState
                    mensaje="Error al cargar la lista de usuarios"
                    onRetry={() => void refetch()}
                />
            )}

            {!isLoading && !isError && (
                <UserList
                    users={users}
                    currentUserId={usuario?.id}
                    onToggleActive={handleToggleActive}
                />
            )}
        </div>
    );
};