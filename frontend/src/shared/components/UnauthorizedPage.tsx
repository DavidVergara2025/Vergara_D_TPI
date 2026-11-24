import React from 'react';
import { Link } from 'react-router-dom';

export const UnauthorizedPage: React.FC = () => {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-950/50 text-red-600 flex items-center justify-center rounded-full mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                403 - Acceso Denegado
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
                No tienes los permisos requeridos para acceder a esta sección. Esta área está reservada a administradores.
            </p>
            <Link
                to="/"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition"
            >
                Volver al Inicio
            </Link>
        </div>
    );
};