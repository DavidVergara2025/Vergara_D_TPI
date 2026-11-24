import { useState } from 'react';
import { useCategories } from '../hooks/useCategories';
import CategoriaList from '../components/CategoriaList';
import CategoriaModal from '../components/CategoriaModal';
import { LoadingState } from '@/shared/components/LoadingState';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { useAuth } from '@/features/auth';
import type { Categoria, CategoriaFormData } from '../types';

export const CategoriesPage = () => {
    const { hasRole } = useAuth();
    const isAdmin = hasRole('admin');
    const { categorias, isLoading, isError, error, refetch, createCategoria, updateCategoria, deleteCategoria } =
        useCategories();

    const [modalAbierto, setModalAbierto] = useState(false);
    const [categoriaEditando, setCategoriaEditando] = useState<Categoria | null>(null);

    const handleAbrirCrear = () => {
        setCategoriaEditando(null);
        setModalAbierto(true);
    };

    const handleAbrirEditar = (categoria: Categoria) => {
        setCategoriaEditando(categoria);
        setModalAbierto(true);
    };

    const handleCerrarModal = () => {
        setModalAbierto(false);
        setCategoriaEditando(null);
    };

    const handleSubmitModal = async (data: CategoriaFormData) => {
        try {
            if (categoriaEditando) {
                await updateCategoria({ id: categoriaEditando.id, data });
            } else {
                await createCategoria(data);
            }
            handleCerrarModal();
        } catch {
            // Notificación ya manejada en useCategories
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Seguro que deseas eliminar esta categoría?')) {
            try {
                await deleteCategoria(id);
            } catch {
                // Notificación ya manejada en useCategories
            }
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Gestión de Categorías</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Creá o editá una categoría
                    </p>
                </div>
                {isAdmin && (
                    <button
                        onClick={handleAbrirCrear}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-sm"
                    >
                        + Nueva categoría
                    </button>
                )}
            </div>

            {isLoading && <LoadingState mensaje="Cargando listado de categorías..." />}

            {isError && (
                <ErrorState
                    mensaje={`Error: ${error instanceof Error ? error.message : 'Error al cargar categorías'}`}
                    onRetry={() => refetch()}
                />
            )}

            {!isLoading && !isError && categorias.length === 0 && (
                <EmptyState mensaje="Todavía no hay categorías registradas en el catálogo." />
            )}

            {!isLoading && !isError && categorias.length > 0 && (
                <CategoriaList
                    categorias={categorias}
                    onEdit={isAdmin ? handleAbrirEditar : undefined}
                    onDelete={isAdmin ? handleDelete : undefined}
                />
            )}

            <CategoriaModal
                isOpen={modalAbierto}
                categoriaEditando={categoriaEditando}
                onSubmit={handleSubmitModal}
                onCancel={handleCerrarModal}
            />
        </div>
    );
};