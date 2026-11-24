import { useMemo, useState } from 'react';
import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type SortingState,
} from '@tanstack/react-table';
import type { Producto, ProductoStockUpdate } from '../types';

type ProductoListProps = {
    productos: Producto[];
    onEdit?: (producto: Producto) => void;
    onDelete?: (id: number) => void;
    onUpdateStock?: (id: number, data: ProductoStockUpdate) => void;
};

export default function ProductoList({
    productos,
    onEdit,
    onDelete,
    onUpdateStock,
}: ProductoListProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 8 });

    const columns = useMemo<ColumnDef<Producto>[]>(() => {
        const cols: ColumnDef<Producto>[] = [
            {
                accessorKey: 'id',
                header: 'ID',
            },
            {
                accessorKey: 'nombre',
                header: 'Nombre',
            },
            {
                id: 'categoria',
                header: 'Categoría',
                cell: ({ row }) =>
                    row.original.categoria?.nombre ??
                    `#${row.original.categoria_id}`,
            },
            {
                accessorKey: 'precio_base',
                header: 'Precio',
                cell: ({ getValue }) =>
                    `$${Number(getValue()).toLocaleString('es-AR', {
                        minimumFractionDigits: 2,
                    })}`,
            },
            {
                accessorKey: 'stock',
                header: 'Stock',
                cell: ({ row }) => {
                    const p = row.original;
                    return (
                        <div className="inline-flex items-center gap-1.5">
                            {onUpdateStock && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        onUpdateStock(p.id, {
                                            stock: Math.max(0, p.stock - 1),
                                            disponible: p.disponible,
                                        })
                                    }
                                    className="px-2 py-0.5 rounded border border-gray-300 dark:border-zinc-700 text-xs font-bold hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer"
                                    title="Restar 1 de stock"
                                >
                                    −
                                </button>
                            )}
                            <span className="font-bold min-w-8 text-center">
                                {p.stock}
                            </span>
                            {onUpdateStock && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        onUpdateStock(p.id, {
                                            stock: p.stock + 1,
                                            disponible: p.disponible,
                                        })
                                    }
                                    className="px-2 py-0.5 rounded border border-gray-300 dark:border-zinc-700 text-xs font-bold hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer"
                                    title="Sumar 1 de stock"
                                >
                                    +
                                </button>
                            )}
                        </div>
                    );
                },
            },
            {
                accessorKey: 'disponible',
                header: 'Disponibilidad',
                cell: ({ row }) => {
                    const p = row.original;
                    return (
                        <button
                            type="button"
                            onClick={() =>
                                onUpdateStock?.(p.id, {
                                    stock: p.stock,
                                    disponible: !p.disponible,
                                })
                            }
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold cursor-pointer transition ${p.disponible
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                                }`}
                            title="Clic para alternar disponibilidad"
                        >
                            {p.disponible ? 'Disponible' : 'No disponible'}
                        </button>
                    );
                },
            },
        ];

        if (onEdit || onDelete) {
            cols.push({
                id: 'acciones',
                header: () => <div className="text-right">Acciones</div>,
                enableSorting: false,
                cell: ({ row }) => (
                    <div className="flex justify-end gap-3">
                        {onEdit && (
                            <button
                                type="button"
                                onClick={() => onEdit(row.original)}
                                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                            >
                                Editar
                            </button>
                        )}
                        {onDelete && (
                            <button
                                type="button"
                                onClick={() => onDelete(row.original.id)}
                                className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline cursor-pointer"
                            >
                                Dar de baja
                            </button>
                        )}
                    </div>
                ),
            });
        }

        return cols;
    }, [onEdit, onDelete, onUpdateStock]);

    const table = useReactTable({
        data: productos,
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
                                <th key={header.id} className="px-4 py-3">
                                    {header.isPlaceholder ? null : (
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-1 font-inherit text-inherit uppercase tracking-wider cursor-pointer disabled:cursor-default"
                                            onClick={header.column.getToggleSortingHandler()}
                                            disabled={!header.column.getCanSort()}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {{
                                                asc: ' ▲',
                                                desc: ' ▼',
                                            }[
                                                header.column.getIsSorted() as string
                                            ] ?? null}
                                        </button>
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                    {table.getRowModel().rows.map((row) => (
                        <tr
                            key={row.id}
                            className="hover:bg-gray-50/80 dark:hover:bg-zinc-800/40 transition-colors"
                        >
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className="px-4 py-3">
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            <nav
                className="flex items-center justify-between border-t border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50 px-6 py-3"
                aria-label="Paginación"
            >
                <span className="text-xs text-gray-500 dark:text-gray-400">
                    Página{' '}
                    <span className="font-semibold">
                        {table.getState().pagination.pageIndex + 1}
                    </span>{' '}
                    de{' '}
                    <span className="font-semibold">
                        {table.getPageCount() || 1}
                    </span>
                </span>
                <div className="flex gap-2">
                    <button
                        type="button"
                        className="rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Anterior
                    </button>
                    <button
                        type="button"
                        className="rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
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