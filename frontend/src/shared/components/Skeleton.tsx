export function Skeleton({
    mensaje = 'Cargando información...',
    cards = 6,
}: {
    mensaje?: string;
    cards?: number;
}) {
    return (
        <div className="space-y-4 py-6" aria-busy="true">
            <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                {mensaje}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: cards }).map((_, idx) => (
                    <div
                        key={idx}
                        className="h-56 w-full animate-pulse rounded-xl bg-gray-200 dark:bg-zinc-800"
                    />
                ))}
            </div>
        </div>
    );
}