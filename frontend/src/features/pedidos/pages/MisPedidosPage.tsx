import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EstadoError } from '@/shared/components/EstadoError';
import { EstadoVacio } from '@/shared/components/EstadoVacio';
import { Paginacion } from '@/shared/components/Paginacion';
import { Skeleton } from '@/shared/components/Skeleton';
import { BadgeEstado } from '@/shared/ui';
import { useAuthStore } from '@/store/authStore';
import { PedidoDetalleModal } from '../components/PedidoDetalleModal';
import { useCancelarPedido, usePedidos } from '../hooks/usePedidos';
import type { Pedido } from '../types';

const LIMIT_MIS_PEDIDOS = 10;

export const MisPedidosPage: React.FC = () => {
    const [skip, setSkip] = useState(0);
    const [pedidoSeleccionado, setPedidoSeleccionado] =
        useState<Pedido | null>(null);

    const usuario = useAuthStore((s) => s.usuario);
    const { pedidos, isLoading, isError, refetch } = usePedidos({
        skip: 0,
        limit: 100,
    });
    const cancelarMutation = useCancelarPedido();

    const misPedidos = pedidos.filter((p) => p.usuario_id === usuario?.id);
    const totalMisPedidos = misPedidos.length;
    const pedidosPaginados = misPedidos.slice(skip, skip + LIMIT_MIS_PEDIDOS);

    const handleCancelar = async (pedidoId: number) => {
        if (
            window.confirm(
                `¿Confirmás la cancelación del Pedido #${pedidoId}? Se restituirá el stock de sus productos.`
            )
        ) {
            await cancelarMutation.mutateAsync(pedidoId);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                    Mis Pedidos
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Consultá el estado de tus compras personales o cancelá un
                    pedido si aún está pendiente.
                </p>
            </div>

            {isLoading && (
                <Skeleton mensaje="Cargando tus pedidos..." cards={3} />
            )}

            {isError && (
                <EstadoError
                    mensaje="No se pudieron cargar tus pedidos."
                    onRetry={() => void refetch()}
                />
            )}

            {!isLoading && !isError && misPedidos.length === 0 && (
                <EstadoVacio
                    mensaje="Todavía no realizaste ningún pedido con tu cuenta."
                    accion={
                        <Link
                            to="/"
                            className="inline-block bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition"
                        >
                            Explorar el Catálogo
                        </Link>
                    }
                />
            )}

            {!isLoading && !isError && misPedidos.length > 0 && (
                <>
                    <div className="space-y-4">
                        {pedidosPaginados.map((pedido) => (
                            <div
                                key={pedido.id}
                                className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                            >
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <span className="text-base font-extrabold text-gray-900 dark:text-white">
                                            Pedido #{pedido.id}
                                        </span>
                                        <BadgeEstado estado={pedido.estado} />
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {new Date(
                                            pedido.created_at
                                        ).toLocaleString('es-AR')}{' '}
                                        · Pago: {pedido.forma_pago} · Entrega:{' '}
                                        {pedido.direccion_entrega}
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-300">
                                        {pedido.items
                                            .map(
                                                (i) =>
                                                    `${i.cantidad}x ${i.nombre_producto}`
                                            )
                                            .join(', ')}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between sm:justify-end gap-4">
                                    <span className="text-lg font-extrabold text-gray-900 dark:text-white">
                                        $
                                        {pedido.total.toLocaleString('es-AR', {
                                            minimumFractionDigits: 2,
                                        })}
                                    </span>

                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setPedidoSeleccionado(pedido)
                                            }
                                            className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-zinc-700 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-zinc-800 transition cursor-pointer"
                                        >
                                            Ver detalle
                                        </button>

                                        {pedido.estado === 'PENDIENTE' && (
                                            <button
                                                type="button"
                                                disabled={
                                                    cancelarMutation.isPending
                                                }
                                                onClick={() =>
                                                    void handleCancelar(
                                                        pedido.id
                                                    )
                                                }
                                                className="px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 text-xs font-semibold transition cursor-pointer"
                                            >
                                                Cancelar pedido
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Paginacion
                        total={totalMisPedidos}
                        skip={skip}
                        limit={LIMIT_MIS_PEDIDOS}
                        onPageChange={setSkip}
                    />
                </>
            )}

            <PedidoDetalleModal
                pedido={pedidoSeleccionado}
                onClose={() => setPedidoSeleccionado(null)}
            />
        </div>
    );
};