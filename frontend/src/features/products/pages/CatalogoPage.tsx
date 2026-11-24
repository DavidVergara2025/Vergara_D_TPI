import React, { useState } from 'react';
import { useCategories } from '@/features/categories';
import { Paginacion } from '@/shared/components/Paginacion';
import { Skeleton } from '@/shared/components/Skeleton';
import { EstadoVacio } from '@/shared/components/EstadoVacio';
import { EstadoError } from '@/shared/components/EstadoError';
import { ProductoCard } from '../components/ProductoCard';
import { useProducts } from '../hooks/useProducts';

const LIMIT_CATALOGO = 6;

export const CatalogoPage: React.FC = () => {
    const [skip, setSkip] = useState(0);
    const [search, setSearch] = useState('');
    const [categoriaId, setCategoriaId] = useState<number | null>(null);

    const { categorias } = useCategories();
    const { productos, total, isLoading, isError, refetch } = useProducts({
        skip,
        limit: LIMIT_CATALOGO,
        search,
        categoria_id: categoriaId,
    });

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setSkip(0);
    };

    const handleCategoriaChange = (id: number | null) => {
        setCategoriaId(id);
        setSkip(0);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                        Catálogo de Comidas
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Elegí tus platos favoritos, agregalos al carrito y
                        recibilos en tu domicilio.
                    </p>
                </div>

                <div className="w-full md:w-80">
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        placeholder="Buscar por nombre (ej: Pizza, Hamburguesa)..."
                        className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition"
                    />
                </div>
            </div>

            {/* Filtro por categoría */}
            <div className="flex items-center gap-2 flex-wrap mb-6">
                <button
                    type="button"
                    onClick={() => handleCategoriaChange(null)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${categoriaId === null
                            ? 'bg-orange-600 text-white shadow-xs'
                            : 'bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
                        }`}
                >
                    Todas
                </button>
                {categorias.map((cat) => (
                    <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleCategoriaChange(cat.id)}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${categoriaId === cat.id
                                ? 'bg-orange-600 text-white shadow-xs'
                                : 'bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
                            }`}
                    >
                        {cat.nombre}
                    </button>
                ))}
            </div>

            {isLoading && (
                <Skeleton
                    mensaje="Cargando catálogo de productos..."
                    cards={LIMIT_CATALOGO}
                />
            )}

            {isError && (
                <EstadoError
                    mensaje="Error al cargar el catálogo de productos."
                    onRetry={() => void refetch()}
                />
            )}

            {!isLoading && !isError && productos.length === 0 && (
                <EstadoVacio mensaje="No se encontraron productos con los filtros seleccionados." />
            )}

            {!isLoading && !isError && productos.length > 0 && (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {productos.map((prod) => (
                            <ProductoCard key={prod.id} producto={prod} />
                        ))}
                    </div>

                    <Paginacion
                        total={total}
                        skip={skip}
                        limit={LIMIT_CATALOGO}
                        onPageChange={setSkip}
                    />
                </>
            )}
        </div>
    );
};