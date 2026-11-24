import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from '@tanstack/react-form';
import { handleApiError } from '@/shared/api/handleApiError';
import { useAuth } from '../hooks/useAuth';

export const LoginPage: React.FC = () => {
    const [errorMsg, setErrorMsg] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from =
        (location.state as { from?: { pathname: string } })?.from?.pathname ||
        '/';

    const form = useForm({
        defaultValues: {
            username: '',
            password: '',
        },
        validators: {
            onSubmit: ({ value }) => {
                if (!value.username.trim()) {
                    return {
                        fields: {
                            username: 'El nombre de usuario es obligatorio',
                        },
                    };
                }
                if (!value.password) {
                    return {
                        fields: { password: 'La contraseña es obligatoria' },
                    };
                }
                return undefined;
            },
        },
        onSubmit: async ({ value }) => {
            setErrorMsg('');
            try {
                await login(value.username, value.password);
                navigate(from, { replace: true });
            } catch (err: unknown) {
                setErrorMsg(
                    handleApiError(
                        err,
                        'Error al iniciar sesión. Verifica tus credenciales.'
                    )
                );
            }
        },
    });

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-800 w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center mb-2">
                    Iniciar Sesión
                </h2>
                <p className="text-xs text-center text-gray-500 dark:text-gray-400 mb-6">
                    Ingresá con tu usuario (ej: <code className="font-semibold">admin</code> / <code className="font-semibold">Admin1234!</code>)
                </p>

                {errorMsg && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border-l-4 border-red-500 text-red-700 dark:text-red-400 text-sm rounded">
                        {errorMsg}
                    </div>
                )}

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        void form.handleSubmit();
                    }}
                    className="space-y-4"
                >
                    <form.Field name="username">
                        {(field) => (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Usuario o Email
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                    placeholder="admin"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition"
                                />
                                {field.state.meta.errors.map((err) => (
                                    <p
                                        key={String(err)}
                                        className="mt-1 text-xs text-red-500 font-medium"
                                    >
                                        {String(err)}
                                    </p>
                                ))}
                            </div>
                        )}
                    </form.Field>

                    <form.Field name="password">
                        {(field) => (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Contraseña
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                    placeholder="••••••••"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition"
                                />
                                {field.state.meta.errors.map((err) => (
                                    <p
                                        key={String(err)}
                                        className="mt-1 text-xs text-red-500 font-medium"
                                    >
                                        {String(err)}
                                    </p>
                                ))}
                            </div>
                        )}
                    </form.Field>

                    <button
                        type="submit"
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 px-4 rounded-lg transition cursor-pointer"
                    >
                        Ingresar
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    ¿No tenés una cuenta?{' '}
                    <Link
                        to="/register"
                        className="text-orange-600 dark:text-orange-400 hover:underline font-semibold"
                    >
                        Registrate aquí
                    </Link>
                </p>
            </div>
        </div>
    );
};