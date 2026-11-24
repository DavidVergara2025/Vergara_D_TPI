import React from 'react';
import { useCartStore } from '@/store/cartStore';
import { useNotificationStore } from '@/store/notificationStore';
import type { Producto } from '../types';

export const ProductoCard: React.FC<{ producto: Producto }> = ({
    producto,
}) => {
    const agregar = useCartStore((s) => s.agregar);
    const cambiarCantidad = useCartStore((s) => s.cambiarCantidad);
    const items = useCartStore((s) => s.items);
    const showNotification = useNotificationStore((s) => s.showNotification);

    const enCarrito =
        items.find((i) => i.producto_id === producto.id)?.cantidad ?? 0;
    const sinStock = !producto.disponible || producto.stock <= 0;
    const topeAlcanzado = enCarrito >= producto.stock;

    const handleAgregarInicial = () => {
        if (sinStock) return;
        agregar(
            {
                producto_id: producto.id,
                nombre: producto.nombre,
                precio_unitario: producto.precio_base,
                imagen_url: producto.imagen_url,
                stock_maximo: producto.stock,
            },
            1
        );
        showNotification(`"${producto.nombre}" agregado al carrito`, 'success');
    };

    return (
        <div className="flex flex-col rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs hover:shadow-md transition-shadow">
            <div className="relative h-44 w-full bg-gray-100 dark:bg-zinc-800 overflow-hidden">
                {producto.imagen_url ? (
                    <img
                        src={producto.imagen_url}
                        alt={producto.nombre}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center text-4xl">
                        🍽️
                    </div>
                )}
                {producto.categoria && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-black/70 text-white backdrop-blur-xs">
                        {producto.categoria.nombre}
                    </span>
                )}
                <span
                    className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold ${sinStock
                            ? 'bg-rose-600 text-white'
                            : 'bg-emerald-600 text-white'
                        }`}
                >
                    {sinStock ? 'Sin stock' : `Stock: ${producto.stock}`}
                </span>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                <div>
                    <h3 className="text-base font-bold text-gray-800 dark:text-gray-100 mb-1">
                        {producto.nombre}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                        {producto.descripcion || 'Sin descripción'}
                    </p>
                </div>

                <div className="pt-2 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between gap-2">
                    <span className="text-lg font-extrabold text-gray-900 dark:text-white">
                        $
                        {producto.precio_base.toLocaleString('es-AR', {
                            minimumFractionDigits: 2,
                        })}
                    </span>

                    {sinStock ? (
                        <button
                            type="button"
                            disabled
                            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-gray-200 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        >
                            No disponible
                        </button>
                    ) : enCarrito > 0 ? (
                        <div className="inline-flex items-center rounded-xl border-2 border-orange-600 dark:border-orange-500 bg-orange-50/50 dark:bg-orange-950/30">
                            <button
                                type="button"
                                onClick={() =>
                                    cambiarCantidad(producto.id, enCarrito - 1)
                                }
                                className="px-3 py-1.5 text-sm font-extrabold text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/40 rounded-l-xl cursor-pointer transition"
                                title="Restar cantidad"
                            >
                                −
                            </button>
                            <span className="px-3 py-1.5 text-sm font-bold text-gray-900 dark:text-white min-w-8 text-center">
                                {enCarrito}
                            </span>
                            <button
                                type="button"
                                onClick={() =>
                                    cambiarCantidad(producto.id, enCarrito + 1)
                                }
                                disabled={topeAlcanzado}
                                className="px-3 py-1.5 text-sm font-extrabold text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/40 rounded-r-xl disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition"
                                title={
                                    topeAlcanzado
                                        ? 'Stock máximo alcanzado'
                                        : 'Sumar cantidad'
                                }
                            >
                                +
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={handleAgregarInicial}
                            className="px-4 py-2 rounded-xl text-xs font-semibold bg-orange-600 hover:bg-orange-700 text-white transition cursor-pointer shadow-xs"
                        >
                            Agregar al carrito
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};