import { useState } from 'react';
import { useCategories } from '@/features/categories';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { LoadingState } from '@/shared/components/LoadingState';
import ProductoList from '../components/ProductoList';
import ProductoModal from '../components/ProductoModal';
import { useProducts } from '../hooks/useProducts';
import type {
    Producto,
    ProductoFormData,
    ProductoStockUpdate,
} from '../types';

export const ProductsPage = () => {
    const { categorias } = useCategories();
    const {
        productos,
        isLoading,
        isError,
        error,
        refetch,
        createProducto,
        updateProducto,
        updateStockProducto,
        deleteProducto,
    } = useProducts({ skip: 0, limit: 100 });

    const [modalAbierto, setModalAbierto] = useState(false);
    const [productoEditando, setProductoEditando] =
        useState<Producto | null>(null);

    const handleAbrirCrear = () => {
        setProductoEditando(null);
        setModalAbierto(true);
    };

    const handleAbrirEditar = (producto: Producto) => {
        setProductoEditando(producto);
        setModalAbierto(true);
    };

    const handleCerrarModal = () => {
        setModalAbierto(false);
        setProductoEditando(null);
    };

    const handleSubmitModal = async (data: ProductoFormData) => {
        try {
            if (productoEditando) {
                await updateProducto({ id: productoEditando.id, data });
            } else {
                await createProducto(data);
            }
            handleCerrarModal();
        } catch {
            // Notificación ya manejada en useProducts
        }
    };

    const handleUpdateStock = async (
        id: number,
        stockData: ProductoStockUpdate
    ) => {
        try {
            await updateStockProducto({ id, data: stockData });
        } catch {
            // Notificación ya manejada en useProducts
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Seguro que deseas dar de baja este producto?')) {
            try {
                await deleteProducto(id);
            } catch {
                // Notificación ya manejada en useProducts
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                        Productos y Stock
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Creá o editá un producto, o ajustá el stock y la
                        disponibilidad.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={handleAbrirCrear}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-sm"
                >
                    + Nuevo producto
                </button>
            </div>

            {isLoading && (
                <LoadingState mensaje="Cargando listado de productos..." />
            )}

            {isError && (
                <ErrorState
                    mensaje={`Error: ${error instanceof Error ? error.message : 'Error al cargar productos'}`}
                    onRetry={() => void refetch()}
                />
            )}

            {!isLoading && !isError && productos.length === 0 && (
                <EmptyState mensaje="Todavía no hay productos registrados en el catálogo." />
            )}

            {!isLoading && !isError && productos.length > 0 && (
                <ProductoList
                    productos={productos}
                    onEdit={handleAbrirEditar}
                    onDelete={handleDelete}
                    onUpdateStock={handleUpdateStock}
                />
            )}

            <ProductoModal
                isOpen={modalAbierto}
                productoEditando={productoEditando}
                categorias={categorias}
                onSubmit={handleSubmitModal}
                onCancel={handleCerrarModal}
            />
        </div>
    );
};