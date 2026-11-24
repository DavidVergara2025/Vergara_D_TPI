import { useEffect } from 'react';
import { useForm } from '@tanstack/react-form';
import type { Categoria } from '@/features/categories';
import type { Producto, ProductoFormData } from '../types';

type ProductoModalProps = {
    isOpen: boolean;
    productoEditando: Producto | null;
    categorias: Categoria[];
    onSubmit: (data: ProductoFormData) => void;
    onCancel: () => void;
};

const inputClass =
    'w-full rounded-lg border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-100 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition';

export default function ProductoModal({
    isOpen,
    productoEditando,
    categorias,
    onSubmit,
    onCancel,
}: ProductoModalProps) {
    const defaultCatId =
        productoEditando?.categoria_id ?? categorias[0]?.id ?? 1;

    const form = useForm({
        defaultValues: {
            nombre: productoEditando?.nombre ?? '',
            descripcion: productoEditando?.descripcion ?? '',
            precio_base: productoEditando?.precio_base ?? 0,
            stock: productoEditando?.stock ?? 0,
            disponible: productoEditando?.disponible ?? true,
            imagen_url: productoEditando?.imagen_url ?? '',
            categoria_id: defaultCatId,
        } as ProductoFormData,
        validators: {
            onSubmit: ({ value }) => {
                if (!value.nombre.trim()) {
                    return {
                        fields: {
                            nombre: 'El nombre del producto es obligatorio',
                        },
                    };
                }
                if (value.precio_base < 0) {
                    return {
                        fields: {
                            precio_base: 'El precio base no puede ser negativo',
                        },
                    };
                }
                if (value.stock < 0) {
                    return {
                        fields: {
                            stock: 'El stock no puede ser negativo',
                        },
                    };
                }
                return undefined;
            },
        },
        onSubmit: async ({ value }) => {
            onSubmit(value);
        },
    });

    useEffect(() => {
        if (isOpen) {
            if (productoEditando) {
                form.setFieldValue('nombre', productoEditando.nombre);
                form.setFieldValue('descripcion', productoEditando.descripcion);
                form.setFieldValue('precio_base', productoEditando.precio_base);
                form.setFieldValue('stock', productoEditando.stock);
                form.setFieldValue('disponible', productoEditando.disponible);
                form.setFieldValue('imagen_url', productoEditando.imagen_url);
                form.setFieldValue(
                    'categoria_id',
                    productoEditando.categoria_id
                );
            } else {
                form.reset();
                if (categorias[0]) {
                    form.setFieldValue('categoria_id', categorias[0].id);
                }
            }
        }
    }, [productoEditando, isOpen, categorias, form]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-zinc-800 mb-4">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                        {productoEditando
                            ? 'Editar Producto'
                            : 'Nuevo Producto'}
                    </h3>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 font-bold cursor-pointer text-lg"
                    >
                        ✕
                    </button>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        void form.handleSubmit();
                    }}
                    className="flex flex-col gap-4"
                >
                    <form.Field name="nombre">
                        {(field) => (
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                                    Nombre *
                                </label>
                                <input
                                    placeholder="Ej: Pizza Napolitana"
                                    className={inputClass}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
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

                    <form.Field name="categoria_id">
                        {(field) => (
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                                    Categoría *
                                </label>
                                <select
                                    className={inputClass}
                                    value={field.state.value}
                                    onChange={(e) =>
                                        field.handleChange(
                                            Number(e.target.value)
                                        )
                                    }
                                >
                                    {categorias.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </form.Field>

                    <div className="grid grid-cols-2 gap-3">
                        <form.Field name="precio_base">
                            {(field) => (
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                                        Precio Base ($) *
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className={inputClass}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) =>
                                            field.handleChange(
                                                Number(e.target.value)
                                            )
                                        }
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

                        <form.Field name="stock">
                            {(field) => (
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                                        Stock *
                                    </label>
                                    <input
                                        type="number"
                                        step="1"
                                        className={inputClass}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) =>
                                            field.handleChange(
                                                Number(e.target.value)
                                            )
                                        }
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
                    </div>

                    <form.Field name="descripcion">
                        {(field) => (
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                                    Descripción
                                </label>
                                <textarea
                                    rows={2}
                                    placeholder="Descripción del producto"
                                    className={`${inputClass} resize-none`}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                />
                            </div>
                        )}
                    </form.Field>

                    <form.Field name="imagen_url">
                        {(field) => (
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                                    URL de Imagen
                                </label>
                                <input
                                    placeholder="https://ejemplo.com/foto.jpg"
                                    className={inputClass}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                />
                            </div>
                        )}
                    </form.Field>

                    <form.Field name="disponible">
                        {(field) => (
                            <div className="flex items-center gap-2 pt-1">
                                <input
                                    type="checkbox"
                                    id="disponible"
                                    checked={field.state.value}
                                    onChange={(e) =>
                                        field.handleChange(e.target.checked)
                                    }
                                    className="h-4 w-4 rounded-sm border-gray-300 dark:border-zinc-700 text-blue-600 cursor-pointer"
                                />
                                <label
                                    htmlFor="disponible"
                                    className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                                >
                                    Producto disponible para la venta
                                </label>
                            </div>
                        )}
                    </form.Field>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-zinc-800">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition cursor-pointer"
                        >
                            {productoEditando
                                ? 'Guardar Cambios'
                                : 'Crear Producto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}