import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    producto_id: number;
    nombre: string;
    precio_unitario: number;
    cantidad: number;
    imagen_url?: string;
    stock_maximo?: number;
}

interface CartState {
    items: CartItem[];
    agregar: (item: Omit<CartItem, 'cantidad'>, cantidad?: number) => void;
    quitar: (producto_id: number) => void;
    cambiarCantidad: (producto_id: number, cantidad: number) => void;
    vaciar: () => void;
    total: () => number;
    cantidadTotal: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            agregar: (nuevoItem, cantidad = 1) => {
                if (cantidad < 1) return;
                set((state) => {
                    const existente = state.items.find(
                        (i) => i.producto_id === nuevoItem.producto_id
                    );
                    if (existente) {
                        const max = nuevoItem.stock_maximo ?? existente.stock_maximo;
                        const nuevaCant = existente.cantidad + cantidad;
                        const cantidadFinal =
                            max !== undefined ? Math.min(nuevaCant, max) : nuevaCant;

                        return {
                            items: state.items.map((i) =>
                                i.producto_id === nuevoItem.producto_id
                                    ? {
                                        ...i,
                                        ...nuevoItem,
                                        cantidad: cantidadFinal,
                                    }
                                    : i
                            ),
                        };
                    }
                    return {
                        items: [...state.items, { ...nuevoItem, cantidad }],
                    };
                });
            },

            quitar: (producto_id) => {
                set((state) => ({
                    items: state.items.filter((i) => i.producto_id !== producto_id),
                }));
            },

            cambiarCantidad: (producto_id, cantidad) => {
                if (cantidad < 1) {
                    get().quitar(producto_id);
                    return;
                }
                set((state) => ({
                    items: state.items.map((i) => {
                        if (i.producto_id !== producto_id) return i;
                        const cantFinal =
                            i.stock_maximo !== undefined
                                ? Math.min(cantidad, i.stock_maximo)
                                : cantidad;
                        return { ...i, cantidad: cantFinal };
                    }),
                }));
            },

            vaciar: () => set({ items: [] }),

            total: () => {
                return get().items.reduce(
                    (acc, item) => acc + item.precio_unitario * item.cantidad,
                    0
                );
            },

            cantidadTotal: () => {
                return get().items.reduce((acc, item) => acc + item.cantidad, 0);
            },
        }),
        {
            name: 'foodstore-cart-storage',
        }
    )
);