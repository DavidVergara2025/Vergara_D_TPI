import React from 'react';

export type EstadoPedido =
    | 'PENDIENTE'
    | 'EN_PREPARACION'
    | 'ENTREGADO'
    | 'CANCELADO';

const ESTILOS_ESTADO: Record<EstadoPedido, string> = {
    PENDIENTE:
        'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
    EN_PREPARACION:
        'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
    ENTREGADO:
        'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    CANCELADO:
        'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
};

const ETIQUETAS_ESTADO: Record<EstadoPedido, string> = {
    PENDIENTE: 'Pendiente',
    EN_PREPARACION: 'En preparación',
    ENTREGADO: 'Entregado',
    CANCELADO: 'Cancelado',
};

export const BadgeEstado: React.FC<{ estado: string }> = ({ estado }) => {
    const key = (estado in ESTILOS_ESTADO ? estado : 'PENDIENTE') as EstadoPedido;
    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${ESTILOS_ESTADO[key]}`}
        >
            {ETIQUETAS_ESTADO[key] ?? estado}
        </span>
    );
};