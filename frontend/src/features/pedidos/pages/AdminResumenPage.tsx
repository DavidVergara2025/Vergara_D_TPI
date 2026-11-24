import React from 'react';
import { Link } from 'react-router-dom';
import { EstadoError } from '@/shared/components/EstadoError';
import { Skeleton } from '@/shared/components/Skeleton';
import { useResumenPedidos } from '../hooks/usePedidos';

export const AdminResumenPage: React.FC = () => {
    const { data: resumen, isLoading, isError, refetch } = useResumenPedidos();

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                        Resumen del Negocio
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Indicadores en tiempo real de pedidos e ingresos
                        entregados.
                    </p>
                </div>

                <Link
                    to="/admin/pedidos"
                    className="inline-flex items-center px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition"
                >
                    Gestionar Pedidos →
                </Link>
            </div>

            {isLoading && (
                <Skeleton mensaje="Calculando indicadores..." cards={6} />
            )}

            {isError && (
                <EstadoError
                    mensaje="No se pudo obtener el resumen del panel."
                    onRetry={() => void refetch()}
                />
            )}

            {!isLoading && !isError && resumen && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-950/20 p-6 shadow-xs">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                            Pedidos Pendientes
                        </span>
                        <p className="text-4xl font-extrabold text-amber-900 dark:text-amber-200 mt-2">
                            {resumen.pendientes}
                        </p>
                        <p className="text-xs text-amber-700/80 dark:text-amber-400/80 mt-1">
                            Aguardando confirmación o preparación
                        </p>
                    </div>

                    <div className="rounded-2xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/60 dark:bg-blue-950/20 p-6 shadow-xs">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                            En Preparación
                        </span>
                        <p className="text-4xl font-extrabold text-blue-900 dark:text-blue-200 mt-2">
                            {resumen.en_preparacion}
                        </p>
                        <p className="text-xs text-blue-700/80 dark:text-blue-400/80 mt-1">
                            Actualmente en cocina
                        </p>
                    </div>

                    <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/60 dark:bg-emerald-950/20 p-6 shadow-xs">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                            Pedidos Entregados
                        </span>
                        <p className="text-4xl font-extrabold text-emerald-900 dark:text-emerald-200 mt-2">
                            {resumen.entregados}
                        </p>
                        <p className="text-xs text-emerald-700/80 dark:text-emerald-400/80 mt-1">
                            Completados exitosamente
                        </p>
                    </div>

                    <div className="rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/60 dark:bg-rose-950/20 p-6 shadow-xs">
                        <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                            Pedidos Cancelados
                        </span>
                        <p className="text-4xl font-extrabold text-rose-900 dark:text-rose-200 mt-2">
                            {resumen.cancelados}
                        </p>
                        <p className="text-xs text-rose-700/80 dark:text-rose-400/80 mt-1">
                            Con stock restituido al catálogo
                        </p>
                    </div>

                    <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-xs">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Pedidos de Hoy
                        </span>
                        <p className="text-4xl font-extrabold text-gray-900 dark:text-white mt-2">
                            {resumen.pedidos_hoy}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Registrados en la jornada actual
                        </p>
                    </div>

                    <div className="rounded-2xl border border-purple-200 dark:border-purple-900/50 bg-purple-50/60 dark:bg-purple-950/20 p-6 shadow-xs">
                        <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">
                            Ingresos (Entregados)
                        </span>
                        <p className="text-3xl font-extrabold text-purple-900 dark:text-purple-200 mt-2">
                            $
                            {resumen.ingresos_entregados.toLocaleString(
                                'es-AR',
                                { minimumFractionDigits: 2 }
                            )}
                        </p>
                        <p className="text-xs text-purple-700/80 dark:text-purple-400/80 mt-1">
                            Suma total de pedidos en estado ENTREGADO
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};