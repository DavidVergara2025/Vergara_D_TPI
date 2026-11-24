export function EmptyState({ mensaje }: { mensaje: string }) {
    return (
        <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-12 text-center text-gray-500 dark:text-gray-400 shadow-xs">
            <p className="text-base font-medium">{mensaje}</p>
        </div>
    );
}
