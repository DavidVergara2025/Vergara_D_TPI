import axios from 'axios';

const baseURL =
    (import.meta.env.VITE_API_URL as string | undefined) ||
    'http://localhost:8000/api/v1';

export const axiosInstance = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const api = axiosInstance;

let onSessionInvalidated: (() => void) | null = null;

export function setSessionInvalidatedHandler(handler: () => void): void {
    onSessionInvalidated = handler;
}

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const status: number | undefined = error.response?.status;
        const detail: string | undefined = error.response?.data?.detail;
        const url: string = error.config?.url ?? '';

        const isAuthEndpoint =
            url.includes('/auth/token') || url.includes('/auth/me');

        if (status === 401 && !isAuthEndpoint) {
            onSessionInvalidated?.();
        }

        if (status === 400 && detail === 'Cuenta de usuario desactivada') {
            onSessionInvalidated?.();
        }

        return Promise.reject(error);
    }
);