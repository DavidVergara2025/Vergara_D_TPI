import React from 'react';
import { useNotificationStore } from '@/store/notificationStore';

export const Toast: React.FC = () => {
    const { message, type, isOpen, hideNotification } = useNotificationStore();

    if (!isOpen || !message) return null;

    const bgStyles = {
        success: 'bg-emerald-600 text-white',
        error: 'bg-rose-600 text-white',
        info: 'bg-blue-600 text-white',
    }[type];

    return (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
            <div
                className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl font-medium text-sm ${bgStyles}`}
            >
                <span>{message}</span>
                <button
                    onClick={hideNotification}
                    className="ml-2 hover:opacity-80 text-lg font-bold cursor-pointer"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};