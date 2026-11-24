import React, { useState } from 'react';
import { EstadoError } from '@/shared/components/EstadoError';
import { EstadoVacio } from '@/shared/components/EstadoVacio';
import { Paginacion } from '@/shared/components/Paginacion';
import { Skeleton } from '@/shared/components/Skeleton';
import { BadgeEstado } from '@/shared/ui';
import { PedidoDetalleModal } from '../components/PedidoDetalleModal';
import { useCambiarEstadoPedido, usePedidos } from '../hooks/usePedidos';
import type { EstadoPedido, Pedido } from '../types';

const LIMIT_ADMIN_PEDIDOS = 15;
const ESTADOS_FILTRO = [
    '',
    'PENDIENTE',
    'EN_PREPARACION',
    'ENTREGADO',
    'CANCELADO',
];

export const AdminPedidosPage: React.FC = () => {
    const [skip, setSkip] = useState(0);
    const [estadoFiltro, setEstadoFiltro] = useState('');
    const [pedidoDetalle, setPedidoDetalle] = useState<Pedido | null>(null);

    const { pedidos, total, isLoading, isError, refetch } = usePedidos({
        skip,
        limit: LIMIT_ADMIN_PEDIDOS,
        estado: estadoFiltro || undefined,
    });
    const cambiarEstadoMutation = useCambiarEstadoPedido();

    const handleCambiarEstado = async (
        pedidoId: number,
        nuevoEstado: EstadoPedido
    ) => {
        if (
            nuevoEstado === 'CANCELADO' &&
            !window.confirm(
                `¿Confirmás cancelar el Pedido #${pedidoId}? Se restituirá el stock de sus productos.`
            )
        ) {
            return;
        }
        await cambiarEstadoMutation.mutateAsync({
            pedidoId,
            estado: nuevoEstado,
        });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                        Gestión de Pedidos
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Cancelá o cambiá el estado de los pedidos.
                    </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    {ESTADOS_FILTRO.map((est) => (
                        <button
                            key={est || 'TODOS'}
                            type="button"
                            onClick={() => {
                                setEstadoFiltro(est);
                                setSkip(0);
                            }}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${estadoFiltro === est
                                ? 'bg-purple-600 text-white'
                                : 'bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
                                }`}
                        >
                            {est === ''
                                ? 'Todos'
                                : est.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading && (
                <Skeleton mensaje="Cargando pedidos..." cards={4} />
            )}

            {isError && (
                <EstadoError
                    mensaje="Error al cargar los pedidos."
                    onRetry={() => void refetch()}
                />
            )}

            {!isLoading && !isError && pedidos.length === 0 && (
                <EstadoVacio mensaje="No hay pedidos registrados para el filtro seleccionado." />
            )}

            {!isLoading && !isError && pedidos.length > 0 && (
                <>
                    <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead className="bg-gray-50 dark:bg-zinc-800/60 border-b border-gray-200 dark:border-zinc-800 text-xs font-bold uppercase text-gray-500 dark:text-gray-400">
                                <tr>
                                    <th className="px-4 py-3">#ID</th>
                                    <th className="px-4 py-3">Usuario ID</th>
                                    <th className="px-4 py-3">Fecha</th>
                                    <th className="px-4 py-3">Dirección / Pago</th>
                                    <th className="px-4 py-3">Total</th>
                                    <th className="px-4 py-3">Estado</th>
                                    <th className="px-4 py-3 text-right">
                                        Acciones (Máquina de Estados)
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                                {pedidos.map((p) => (
                                    <tr
                                        key={p.id}
                                        className="hover:bg-gray-50/80 dark:hover:bg-zinc-800/40"
                                    >
                                        <td className="px-4 py-3 font-bold">
                                            #{p.id}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                                            Usuario #{p.usuario_id}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
                                            {new Date(
                                                p.created_at
                                            ).toLocaleString('es-AR')}
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-gray-800 dark:text-gray-200 truncate max-w-xs">
                                                {p.direccion_entrega}
                                            </p>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {p.forma_pago}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 font-bold">
                                            $
                                            {p.total.toLocaleString('es-AR', {
                                                minimumFractionDigits: 2,
                                            })}
                                        </td>
                                        <td className="px-4 py-3">
                                            <BadgeEstado estado={p.estado} />
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="inline-flex items-center justify-end gap-2 flex-wrap">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setPedidoDetalle(p)
                                                    }
                                                    className="px-2.5 py-1 rounded-lg border border-gray-300 dark:border-zinc-700 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer"
                                                >
                                                    Detalle
                                                </button>

                                                {p.estado === 'PENDIENTE' && (
                                                    <>
                                                        <button
                                                            type="button"
                                                            disabled={
                                                                cambiarEstadoMutation.isPending
                                                            }
                                                            onClick={() =>
                                                                void handleCambiarEstado(
                                                                    p.id,
                                                                    'EN_PREPARACION'
                                                                )
                                                            }
                                                            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer"
                                                        >
                                                            → En preparación
                                                        </button>
                                                        <button
                                                            type="button"
                                                            disabled={
                                                                cambiarEstadoMutation.isPending
                                                            }
                                                            onClick={() =>
                                                                void handleCambiarEstado(
                                                                    p.id,
                                                                    'CANCELADO'
                                                                )
                                                            }
                                                            className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer"
                                                        >
                                                            Cancelar
                                                        </button>
                                                    </>
                                                )}

                                                {p.estado ===
                                                    'EN_PREPARACION' && (
                                                        <>
                                                            <button
                                                                type="button"
                                                                disabled={
                                                                    cambiarEstadoMutation.isPending
                                                                }
                                                                onClick={() =>
                                                                    void handleCambiarEstado(
                                                                        p.id,
                                                                        'ENTREGADO'
                                                                    )
                                                                }
                                                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
                                                            >
                                                                → Entregado
                                                            </button>
                                                            <button
                                                                type="button"
                                                                disabled={
                                                                    cambiarEstadoMutation.isPending
                                                                }
                                                                onClick={() =>
                                                                    void handleCambiarEstado(
                                                                        p.id,
                                                                        'CANCELADO'
                                                                    )
                                                                }
                                                                className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer"
                                                            >
                                                                Cancelar
                                                            </button>
                                                        </>
                                                    )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Paginacion
                        total={total}
                        skip={skip}
                        limit={LIMIT_ADMIN_PEDIDOS}
                        onPageChange={setSkip}
                    />
                </>
            )}

            <PedidoDetalleModal
                pedido={pedidoDetalle}
                onClose={() => setPedidoDetalle(null)}
            />
        </div>
    );
};