import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { LoadingState } from '@/shared/components/LoadingState';
import { useAuthStore, type Role } from '@/store/authStore';

interface ProtectedRouteProps {
    allowedRoles?: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    allowedRoles,
}) => {
    const usuario = useAuthStore((s) => s.usuario);
    const cargando = useAuthStore((s) => s.cargando);
    const location = useLocation();

    if (cargando) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-12">
                <LoadingState mensaje="Verificando sesión..." />
            </div>
        );
    }

    if (!usuario) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(usuario.role)) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    return <Outlet />;
};