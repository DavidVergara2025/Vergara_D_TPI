import React from 'react';
import { BadgeEstado, Modal } from '@/shared/ui';
import type { Pedido } from '../types';

export const PedidoDetalleModal: React.FC<{
    pedido: Pedido | null;
    onClose: () => void;
}> = ({ pedido, onClose }) => {
    if (!pedido) return null;

    return (
        <Modal
            isOpen={true}
            title={`Detalle del Pedido #${pedido.id}`}
            onClose={onClose}
        >
            <div className="space-y-4 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 bg-gray-50 dark:bg-zinc-800/60 p-3 rounded-xl">
                    <div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 block">
                            Fecha
                        </span>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                            {new Date(pedido.created_at).toLocaleString('es-AR')}
                        </span>
                    </div>
                    <div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 block">
                            Forma de pago
                        </span>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                            {pedido.forma_pago}
                        </span>
                    </div>
                    <BadgeEstado estado={pedido.estado} />
                </div>

                <div>
                    <span className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 block mb-1">
                        Dirección de entrega
                    </span>
                    <p className="text-gray-800 dark:text-gray-200 font-medium">
                        {pedido.direccion_entrega}
                    </p>
                </div>

                {pedido.notas && (
                    <div>
                        <span className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 block mb-1">
                            Notas
                        </span>
                        <p className="text-gray-600 dark:text-gray-300 italic">
                            {pedido.notas}
                        </p>
                    </div>
                )}

                <div className="border-t border-gray-200 dark:border-zinc-800 pt-3">
                    <h4 className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">
                        Ítems del pedido
                    </h4>
                    <div className="divide-y divide-gray-100 dark:divide-zinc-800">
                        {pedido.items.map((item, index) => (
                            <div
                                key={`${item.producto_id}-${index}`}
                                className="py-2.5 flex items-center justify-between gap-2"
                            >
                                <div>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                                        {item.nombre_producto}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {item.cantidad} x $
                                        {item.precio_unitario.toLocaleString(
                                            'es-AR',
                                            { minimumFractionDigits: 2 }
                                        )}
                                    </p>
                                </div>
                                <span className="font-bold text-gray-900 dark:text-white">
                                    $
                                    {item.subtotal.toLocaleString('es-AR', {
                                        minimumFractionDigits: 2,
                                    })}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-t border-gray-200 dark:border-zinc-800 pt-3 flex items-center justify-between text-base font-extrabold">
                    <span>Total del Pedido</span>
                    <span className="text-orange-600 dark:text-orange-400">
                        $
                        {pedido.total.toLocaleString('es-AR', {
                            minimumFractionDigits: 2,
                        })}
                    </span>
                </div>
            </div>
        </Modal>
    );
};