import { useState, useMemo } from 'react';
import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type SortingState,
} from '@tanstack/react-table';
import type { Categoria } from '../types';

type CategoriaListProps = {
    categorias: Categoria[];
    onEdit?: (categoria: Categoria) => void;
    onDelete?: (id: number) => void;
};

export default function CategoriaList({
    categorias,
    onEdit,
    onDelete,
}: CategoriaListProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });

    const columns = useMemo<ColumnDef<Categoria>[]>(() => {
        const cols: ColumnDef<Categoria>[] = [
            {
                accessorKey: 'id',
                header: 'ID',
                enableSorting: true,
            },
            {
                accessorKey: 'nombre',
                header: 'Nombre',
                enableSorting: true,
            },
            {
                accessorKey: 'descripcion',
                header: 'Descripción',
                enableSorting: true,
            },
        ];
        if (onEdit || onDelete) {
            cols.push({
                id: 'acciones',
                header: () => <div className="text-right">Acciones</div>,
                enableSorting: false,
                cell: ({ row }) => (
                    <div className="flex justify-end gap-2">
                        {onEdit && (
                            <button
                                onClick={() => onEdit(row.original)}
                                className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                            >
                                Editar
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={() => onDelete(row.original.id)}
                                className="text-xs font-semibold text-red-600 hover:text-red-800 hover:underline cursor-pointer"
                            >
                                Eliminar
                            </button>
                        )}
                    </div>
                ),
            });
        }
        return cols;
    }, [onEdit, onDelete]
    );

    const table = useReactTable({
        data: categorias,
        columns,
        state: { sorting, pagination },
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
            <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300 border-collapse">
                <thead className="bg-gray-50 dark:bg-zinc-800/50 border-b border-gray-200 dark:border-zinc-800 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id} className="px-6 py-3">
                                    {header.isPlaceholder ? null : (
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-1 font-inherit text-inherit uppercase tracking-wider cursor-pointer disabled:cursor-default"
                                            onClick={header.column.getToggleSortingHandler()}
                                            disabled={!header.column.getCanSort()}
                                        >
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {{
                                                asc: ' ▲',
                                                desc: ' ▼',
                                            }[header.column.getIsSorted() as string] ?? null}
                                        </button>
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id} className="hover:bg-gray-50/80 dark:hover:bg-zinc-800/40 transition-colors">
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className="px-6 py-4">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Barra de paginación de TanStack Table */}
            <nav
                className="flex items-center justify-between border-t border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50 px-6 py-3"
                aria-label="Paginación"
            >
                <span className="text-xs text-gray-500 dark:text-gray-400">
                    Página <span className="font-semibold">{table.getState().pagination.pageIndex + 1}</span> de{' '}
                    <span className="font-semibold">{table.getPageCount() || 1}</span>
                </span>
                <div className="flex gap-2">
                    <button
                        type="button"
                        className="rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition shadow-2xs"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Anterior
                    </button>
                    <button
                        type="button"
                        className="rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition shadow-2xs"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Siguiente
                    </button>
                </div>
            </nav>
        </div>
    );
}