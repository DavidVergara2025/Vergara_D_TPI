import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from '@tanstack/react-form';
import { handleApiError } from '@/shared/api/handleApiError';
import { useNotificationStore } from '@/store/notificationStore';
import { useAuth } from '../hooks/useAuth';

export const RegisterPage: React.FC = () => {
    const [errorMsg, setErrorMsg] = useState('');
    const { register } = useAuth();
    const showNotification = useNotificationStore((s) => s.showNotification);
    const navigate = useNavigate();

    const form = useForm({
        defaultValues: {
            username: '',
            full_name: '',
            email: '',
            password: '',
        },
        validators: {
            onSubmit: ({ value }) => {
                if (value.username.trim().length < 2) {
                    return {
                        fields: {
                            username:
                                'El usuario debe tener al menos 2 caracteres',
                        },
                    };
                }
                if (value.full_name.trim().length < 2) {
                    return {
                        fields: {
                            full_name:
                                'El nombre completo debe tener al menos 2 caracteres',
                        },
                    };
                }
                if (!value.email.includes('@')) {
                    return {
                        fields: {
                            email: 'Ingresá un correo electrónico válido',
                        },
                    };
                }
                if (value.password.length < 8) {
                    return {
                        fields: {
                            password:
                                'La contraseña debe tener al menos 8 caracteres',
                        },
                    };
                }
                return undefined;
            },
        },
        onSubmit: async ({ value }) => {
            setErrorMsg('');
            try {
                await register(value);
                showNotification(
                    'Cuenta creada exitosamente. Ahora podés iniciar sesión.',
                    'success'
                );
                navigate('/login');
            } catch (err: unknown) {
                setErrorMsg(
                    handleApiError(err, 'Error al registrar el usuario.')
                );
            }
        },
    });

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-800 w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center mb-6">
                    Crear Cuenta
                </h2>

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
                                    Nombre de usuario
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="ej: juanperez"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
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

                    <form.Field name="full_name">
                        {(field) => (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Nombre completo
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="ej: Juan Pérez"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
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

                    <form.Field name="email">
                        {(field) => (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Correo electrónico
                                </label>
                                <input
                                    type="email"
                                    required
                                    placeholder="juan@ejemplo.com"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
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
                                    minLength={8}
                                    placeholder="Mínimo 8 caracteres"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
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
                        Registrarse
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    ¿Ya tenés cuenta?{' '}
                    <Link
                        to="/login"
                        className="text-orange-600 dark:text-orange-400 hover:underline font-semibold"
                    >
                        Iniciá sesión aquí
                    </Link>
                </p>
            </div>
        </div>
    );
};