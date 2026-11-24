import axios from 'axios';

interface FastApiValidationError {
    msg?: string;
    loc?: Array<string | number>;
}

interface FastApiErrorResponse {
    detail?: string | FastApiValidationError[];
}

export function handleApiError(
    error: unknown,
    fallbackMessage = 'Ocurrió un error al procesar la solicitud.'
): string {
    if (axios.isAxiosError<FastApiErrorResponse>(error)) {
        const detail = error.response?.data?.detail;
        if (typeof detail === 'string' && detail.trim().length > 0) {
            return detail;
        }
        if (Array.isArray(detail) && detail.length > 0) {
            return detail
                .map((item) => item.msg ?? 'Dato inválido')
                .join('. ');
        }
    }
    if (error instanceof Error && error.message) {
        return error.message;
    }
    return fallbackMessage;
}