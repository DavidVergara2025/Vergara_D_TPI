import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EstadoVacio } from '@/shared/components/EstadoVacio';
import { useCartStore } from '@/store/cartStore';

export const CarritoPage: React.FC = () => {
    const items = useCartStore((s) => s.items);
    const cambiarCantidad = useCartStore((s) => s.cambiarCantidad);
    const quitar = useCartStore((s) => s.quitar);
    const vaciar = useCartStore((s) => s.vaciar);
    const total = useCartStore((s) => s.total)();
    const navigate = useNavigate();

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                        Tu Carrito
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Revisá tus productos antes de confirmar el pedido.
                    </p>
                </div>
                {items.length > 0 && (
                    <button
                        type="button"
                        onClick={vaciar}
                        className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                    >
                        Vaciar carrito
                    </button>
                )}
            </div>

            {items.length === 0 ? (
                <EstadoVacio
                    mensaje="Tu carrito está vacío."
                    accion={
                        <Link
                            to="/"
                            className="inline-block bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition"
                        >
                            Ir al Catálogo
                        </Link>
                    }
                />
            ) : (
                <div className="space-y-6">
                    <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 divide-y divide-gray-100 dark:divide-zinc-800 overflow-hidden shadow-xs">
                        {items.map((item) => {
                            const subtotal =
                                item.precio_unitario * item.cantidad;
                            return (
                                <div
                                    key={item.producto_id}
                                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                >
                                    <div className="flex items-center gap-4">
                                        {item.imagen_url ? (
                                            <img
                                                src={item.imagen_url}
                                                alt={item.nombre}
                                                className="h-16 w-16 rounded-xl object-cover bg-gray-100"
                                            />
                                        ) : (
                                            <div className="h-16 w-16 rounded-xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-2xl">
                                                🍔
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="font-bold text-gray-800 dark:text-gray-100">
                                                {item.nombre}
                                            </h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Precio unitario: $
                                                {item.precio_unitario.toLocaleString(
                                                    'es-AR',
                                                    { minimumFractionDigits: 2 }
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between sm:justify-end gap-4">
                                        <div className="inline-flex items-center rounded-xl border border-gray-300 dark:border-zinc-700">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    cambiarCantidad(
                                                        item.producto_id,
                                                        item.cantidad - 1
                                                    )
                                                }
                                                className="px-3 py-1 text-sm font-bold hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-l-xl cursor-pointer"
                                            >
                                                −
                                            </button>
                                            <span className="px-3 py-1 text-sm font-semibold">
                                                {item.cantidad}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    cambiarCantidad(
                                                        item.producto_id,
                                                        item.cantidad + 1
                                                    )
                                                }
                                                disabled={
                                                    item.stock_maximo !==
                                                    undefined &&
                                                    item.cantidad >=
                                                    item.stock_maximo
                                                }
                                                className="px-3 py-1 text-sm font-bold hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-r-xl disabled:opacity-40 cursor-pointer"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <span className="w-28 text-right font-bold text-gray-900 dark:text-white">
                                            $
                                            {subtotal.toLocaleString('es-AR', {
                                                minimumFractionDigits: 2,
                                            })}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                quitar(item.producto_id)
                                            }
                                            className="text-xs font-semibold text-rose-600 hover:underline cursor-pointer"
                                        >
                                            Quitar
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
                        <div>
                            <span className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400 block">
                                Total a pagar
                            </span>
                            <span className="text-2xl font-extrabold text-gray-900 dark:text-white">
                                $
                                {total.toLocaleString('es-AR', {
                                    minimumFractionDigits: 2,
                                })}
                            </span>
                        </div>

                        <div className="flex gap-3 w-full sm:w-auto">
                            <Link
                                to="/"
                                className="flex-1 sm:flex-initial text-center px-4 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                            >
                                Seguir comprando
                            </Link>
                            <button
                                type="button"
                                onClick={() => navigate('/checkout')}
                                className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold transition cursor-pointer shadow-xs"
                            >
                                Confirmar pedido →
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};