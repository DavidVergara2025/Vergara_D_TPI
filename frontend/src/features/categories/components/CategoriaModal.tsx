import { useEffect } from 'react';
import { useForm } from '@tanstack/react-form';
import type { Categoria, CategoriaFormData } from '../types';

type CategoriaModalProps = {
    isOpen: boolean;
    categoriaEditando: Categoria | null;
    onSubmit: (data: CategoriaFormData) => void;
    onCancel: () => void;
    errorMessage?: string | null;
};

const inputClass =
    'w-full rounded-lg border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-100 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition';

export default function CategoriaModal({
    isOpen,
    categoriaEditando,
    onSubmit,
    onCancel,
    errorMessage,
}: CategoriaModalProps) {
    const form = useForm({
        defaultValues: {
            nombre: categoriaEditando?.nombre ?? '',
            descripcion: categoriaEditando?.descripcion ?? '',
        } as CategoriaFormData,
        validators: {
            onSubmit: ({ value }) => {
                if (!value.nombre.trim()) {
                    return { fields: { nombre: 'El nombre es obligatorio (no puede estar vacío)' } };
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
            if (categoriaEditando) {
                form.setFieldValue('nombre', categoriaEditando.nombre);
                form.setFieldValue('descripcion', categoriaEditando.descripcion);
            } else {
                form.reset();
            }
        }
    }, [categoriaEditando, isOpen, form]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-zinc-800 mb-4">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                        {categoriaEditando ? 'Editar Categoría' : 'Nueva Categoría'}
                    </h3>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 font-bold cursor-pointer text-lg"
                    >
                        ✕
                    </button>
                </div>

                {errorMessage && (
                    <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-600 dark:text-red-400 font-medium">
                        {errorMessage}
                    </div>
                )}

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
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
                                    placeholder="Ej: Pizzas"
                                    className={inputClass}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                />
                                {field.state.meta.errors.map((err) => (
                                    <p key={String(err)} className="mt-1 text-xs text-red-500 font-medium">
                                        {String(err)}
                                    </p>
                                ))}
                            </div>
                        )}
                    </form.Field>

                    <form.Field name="descripcion">
                        {(field) => (
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                                    Descripción
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Descripción de la categoría"
                                    className={`${inputClass} resize-none`}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                />
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
                            {categoriaEditando ? 'Guardar Cambios' : 'Crear Categoría'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}