import { create } from 'zustand';

export type NotificationType = 'success' | 'error' | 'info';

interface NotificationState {
    message: string | null;
    type: NotificationType;
    isOpen: boolean;
    showNotification: (message: string, type?: NotificationType) => void;
    hideNotification: () => void;
}

let timeoutId: ReturnType<typeof setTimeout> | null = null;

export const useNotificationStore = create<NotificationState>((set) => ({
    message: null,
    type: 'info',
    isOpen: false,

    showNotification: (message: string, type: NotificationType = 'info') => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        set({ message, type, isOpen: true });

        // Se oculta automáticamente a los 3 segundos (según consigna)
        timeoutId = setTimeout(() => {
            set({ isOpen: false });
        }, 3000);
    },

    hideNotification: () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        set({ isOpen: false });
    },
}));