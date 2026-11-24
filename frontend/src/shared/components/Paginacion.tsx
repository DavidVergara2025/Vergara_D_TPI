import React from 'react';

interface PaginacionProps {
    total: number;
    skip: number;
    limit: number;
    onPageChange: (nuevoSkip: number) => void;
}

export const Paginacion: React.FC<PaginacionProps> = ({
    total,
    skip,
    limit,
    onPageChange,
}) => {
    const paginaActual = Math.floor(skip / limit) + 1;
    const totalPaginas = Math.max(1, Math.ceil(total / limit));

    if (total === 0) return null;

    return (
        <nav
            className="flex items-center justify-between border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 rounded-b-xl mt-4"
            aria-label="Paginación"
        >
            <span className="text-xs text-gray-500 dark:text-gray-400">
                Mostrando{' '}
                <span className="font-semibold">
                    {Math.min(skip + 1, total)}
                </span>{' '}
                a{' '}
                <span className="font-semibold">
                    {Math.min(skip + limit, total)}
                </span>{' '}
                de <span className="font-semibold">{total}</span> resultados (Página{' '}
                {paginaActual} de {totalPaginas})
            </span>

            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => onPageChange(Math.max(0, skip - limit))}
                    disabled={skip === 0}
                    className="rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
                >
                    Anterior
                </button>
                <button
                    type="button"
                    onClick={() => onPageChange(skip + limit)}
                    disabled={skip + limit >= total}
                    className="rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
                >
                    Siguiente
                </button>
            </div>
        </nav>
    );
};