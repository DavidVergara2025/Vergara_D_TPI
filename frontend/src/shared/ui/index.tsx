import React from 'react';

export { BadgeEstado, type EstadoPedido } from './BadgeEstado';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'success';
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    className = '',
    children,
    ...props
}) => {
    const variants = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs',
        secondary:
            'bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-700',
        danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs',
        success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs',
    }[variant];

    return (
        <button
            className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variants} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export const Card: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className = '' }) => (
    <div
        className={`rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs ${className}`}
    >
        {children}
    </div>
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    className = '',
    ...props
}) => (
    <div className="w-full">
        {label && (
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                {label}
            </label>
        )}
        <input
            className={`w-full rounded-lg border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-100 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition ${className}`}
            {...props}
        />
        {error && (
            <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>
        )}
    </div>
);

export const Modal: React.FC<{
    isOpen: boolean;
    title: string;
    onClose: () => void;
    children: React.ReactNode;
}> = ({ isOpen, title, onClose, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-zinc-800">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-zinc-800 mb-4">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                        {title}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 font-bold cursor-pointer text-lg"
                    >
                        ✕
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};