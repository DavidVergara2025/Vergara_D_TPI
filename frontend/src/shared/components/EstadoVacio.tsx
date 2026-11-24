import React from 'react';

export function EstadoVacio({
    mensaje,
    accion,
}: {
    mensaje: string;
    accion?: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border border-dashed border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-12 text-center text-gray-500 dark:text-gray-400 shadow-xs">
            <p className="text-base font-medium mb-3">{mensaje}</p>
            {accion && <div className="mt-4">{accion}</div>}
        </div>
    );
}