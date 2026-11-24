export function LoadingState({ mensaje = 'Cargando información...' }: { mensaje?: string }) {
    return (
        <div className="space-y-3 py-6" aria-busy="true">
            <div className="text-sm text-gray-400 font-medium">{mensaje}</div>
            {[1, 2, 3].map((n) => (
                <div key={n} className="h-12 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
            ))}
        </div>
    );
}
