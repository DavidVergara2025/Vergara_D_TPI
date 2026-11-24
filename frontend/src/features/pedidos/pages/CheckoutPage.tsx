import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from '@tanstack/react-form';
import { EstadoVacio } from '@/shared/components/EstadoVacio';
import { useCartStore } from '@/store/cartStore';
import { useCrearPedido } from '../hooks/usePedidos';
import type { FormaPago } from '../types';

export const CheckoutPage: React.FC = () => {
    const items = useCartStore((s) => s.items);
    const vaciar = useCartStore((s) => s.vaciar);
    const total = useCartStore((s) => s.total)();
    const crearPedidoMutation = useCrearPedido();
    const navigate = useNavigate();

    const form = useForm({
        defaultValues: {
            direccion_entrega: '',
            forma_pago: 'EFECTIVO' as FormaPago,
            notas: '',
        },
        validators: {
            onSubmit: ({ value }) => {
                const dir = value.direccion_entrega.trim();
                if (dir.length < 5 || dir.length > 200) {
                    return {
                        fields: {
                            direccion_entrega:
                                'La dirección de entrega debe tener entre 5 y 200 caracteres (RN-06)',
                        },
                    };
                }
                return undefined;
            },
        },
        onSubmit: async ({ value }) => {
            await crearPedidoMutation.mutateAsync({
                items: items.map((i) => ({
                    producto_id: i.producto_id,
                    cantidad: i.cantidad,
                })),
                forma_pago: value.forma_pago,
                direccion_entrega: value.direccion_entrega.trim(),
                notas: value.notas.trim() || undefined,
            });
            vaciar();
            navigate('/mis-pedidos');
        },
    });

    if (items.length === 0) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-8">
                <EstadoVacio
                    mensaje="No tenés productos en el carrito para confirmar un pedido."
                    accion={
                        <Link
                            to="/"
                            className="inline-block bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition"
                        >
                            Volver al Catálogo
                        </Link>
                    }
                />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6">
                Confirmar Pedido (Checkout)
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="md:col-span-3 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-xs">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
                        Datos de Entrega y Pago
                    </h2>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            void form.handleSubmit();
                        }}
                        className="space-y-4"
                    >
                        <form.Field name="direccion_entrega">
                            {(field) => (
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-700 dark:text-gray-300 mb-1">
                                        Dirección de entrega *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ej: Av. San Martín 1250, Piso 3 Dpto B"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) =>
                                            field.handleChange(e.target.value)
                                        }
                                        className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 px-3.5 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
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

                        <form.Field name="forma_pago">
                            {(field) => (
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-700 dark:text-gray-300 mb-1">
                                        Forma de pago *
                                    </label>
                                    <select
                                        value={field.state.value}
                                        onChange={(e) =>
                                            field.handleChange(
                                                e.target.value as FormaPago
                                            )
                                        }
                                        className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 px-3.5 py-2.5 text-sm outline-none focus:border-orange-500"
                                    >
                                        <option value="EFECTIVO">
                                            Efectivo al recibir
                                        </option>
                                        <option value="TRANSFERENCIA">
                                            Transferencia bancaria
                                        </option>
                                    </select>
                                </div>
                            )}
                        </form.Field>

                        <form.Field name="notas">
                            {(field) => (
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-700 dark:text-gray-300 mb-1">
                                        Notas adicionales (opcional)
                                    </label>
                                    <textarea
                                        rows={3}
                                        placeholder="Ej: El timbre no funciona, golpear puerta..."
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) =>
                                            field.handleChange(e.target.value)
                                        }
                                        className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 px-3.5 py-2.5 text-sm outline-none focus:border-orange-500 resize-none"
                                    />
                                </div>
                            )}
                        </form.Field>

                        <div className="pt-2 flex gap-3">
                            <Link
                                to="/carrito"
                                className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                            >
                                ← Volver al carrito
                            </Link>
                            <button
                                type="submit"
                                disabled={crearPedidoMutation.isPending}
                                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 px-5 rounded-xl transition cursor-pointer disabled:opacity-50"
                            >
                                {crearPedidoMutation.isPending
                                    ? 'Procesando pedido...'
                                    : 'Confirmar y Enviar Pedido'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="md:col-span-2 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-xs h-fit">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
                        Resumen de compra
                    </h2>
                    <div className="divide-y divide-gray-100 dark:divide-zinc-800 text-sm space-y-2">
                        {items.map((item) => (
                            <div
                                key={item.producto_id}
                                className="pt-2 flex justify-between gap-2"
                            >
                                <span className="text-gray-600 dark:text-gray-300">
                                    {item.cantidad}x {item.nombre}
                                </span>
                                <span className="font-semibold">
                                    $
                                    {(
                                        item.precio_unitario * item.cantidad
                                    ).toLocaleString('es-AR', {
                                        minimumFractionDigits: 2,
                                    })}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-zinc-800 flex justify-between items-center text-lg font-extrabold">
                        <span>Total</span>
                        <span className="text-orange-600 dark:text-orange-400">
                            $
                            {total.toLocaleString('es-AR', {
                                minimumFractionDigits: 2,
                            })}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};