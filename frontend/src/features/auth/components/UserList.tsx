import React, { useMemo, useState } from 'react';
import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type SortingState,
} from '@tanstack/react-table';
import type { UserPublic } from '../types';

interface UserListProps {
    users: UserPublic[];
    currentUserId?: number;
    onToggleActive: (userId: number, currentlyDisabled: boolean) => void;
}

export const UserList: React.FC<UserListProps> = ({
    users,
    currentUserId,
    onToggleActive,
}) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 8 });

    const columns = useMemo<ColumnDef<UserPublic>[]>(
        () => [
            {
                accessorKey: 'username',
                header: 'Username',
                cell: ({ row }) => (
                    <span className="font-bold text-gray-900 dark:text-white">
                        {row.original.username}
                        {row.original.id === currentUserId && (
                            <span className="ml-2 text-xs font-normal text-gray-500">
                                (Tú)
                            </span>
                        )}
                    </span>
                ),
            },
            {
                accessorKey: 'full_name',
                header: 'Nombre',
            },
            {
                accessorKey: 'email',
                header: 'Email',
            },
            {
                accessorKey: 'role',
                header: 'Rol',
                cell: ({ getValue }) => {
                    const rol = String(getValue());
                    return (
                        <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${rol === 'admin'
                                    ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                                    : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                                }`}
                        >
                            {rol}
                        </span>
                    );
                },
            },
            {
                accessorKey: 'disabled',
                header: 'Estado',
                cell: ({ getValue }) => {
                    const isDisabled = Boolean(getValue());
                    return (
                        <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${isDisabled
                                    ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                                    : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                                }`}
                        >
                            {isDisabled ? 'Desactivado' : 'Activo'}
                        </span>
                    );
                },
            },
            {
                id: 'acciones',
                header: () => <div className="text-right">Acciones</div>,
                enableSorting: false,
                cell: ({ row }) => {
                    const u = row.original;
                    const esUsuarioActual = u.id === currentUserId;

                    if (esUsuarioActual && !u.disabled) {
                        return (
                            <div className="text-right text-xs text-gray-400 italic">
                                Sesión actual
                            </div>
                        );
                    }

                    return (
                        <div className="text-right">
                            <button
                                type="button"
                                onClick={() => onToggleActive(u.id, u.disabled)}
                                className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${u.disabled
                                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                        : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100'
                                    }`}
                            >
                                {u.disabled ? 'Activar' : 'Desactivar'}
                            </button>
                        </div>
                    );
                },
            },
        ],
        [currentUserId, onToggleActive]
    );

    const table = useReactTable({
        data: users,
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
                                <th key={header.id} className="px-6 py-3.5">
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
                            className="hover:bg-gray-50/80 dark:hover:bg-zinc-800/40"
                        >
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className="px-6 py-4">
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
};