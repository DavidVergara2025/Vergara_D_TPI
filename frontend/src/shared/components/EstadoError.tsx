export function EstadoError({
    mensaje,
    onRetry,
}: {
    mensaje: string;
    onRetry?: () => void;
}) {
    return (
        <div
            role="alert"
            className="my-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 p-4 text-red-700 dark:text-red-400 shadow-xs"
        >
            <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{mensaje}</p>
                {onRetry && (
                    <button
                        type="button"
                        onClick={onRetry}
                        className="rounded-lg border border-red-300 bg-white dark:bg-zinc-800 dark:border-red-800 px-3 py-1 text-xs font-semibold text-red-700 dark:text-red-400 hover:bg-red-100 transition cursor-pointer"
                    >
                        Reintentar
                    </button>
                )}
            </div>
        </div>
    );
}