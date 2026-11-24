import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/shared/api/axiosInstance';
import { handleApiError } from '@/shared/api/handleApiError';
import { useNotificationStore } from '@/store/notificationStore';
import type {
    Producto,
    ProductoFilters,
    ProductoFormData,
    ProductosPaginados,
    ProductoStockUpdate,
} from '../types';

export const useProducts = (filters: ProductoFilters = { skip: 0, limit: 100 }) => {
    const queryClient = useQueryClient();
    const showNotification = useNotificationStore((s) => s.showNotification);

    const query = useQuery({
        queryKey: ['productos', filters],
        queryFn: async (): Promise<ProductosPaginados> => {
            const params: Record<string, string | number | boolean> = {
                skip: filters.skip ?? 0,
                limit: filters.limit ?? 100,
            };
            if (filters.search && filters.search.trim()) {
                params.search = filters.search.trim();
            }
            if (filters.categoria_id) {
                params.categoria_id = filters.categoria_id;
            }
            if (filters.disponible !== undefined && filters.disponible !== null) {
                params.disponible = filters.disponible;
            }
            const { data } = await axiosInstance.get<ProductosPaginados>(
                '/productos',
                { params }
            );
            return data;
        },
    });

    const createMutation = useMutation({
        mutationFn: async (formData: ProductoFormData): Promise<Producto> => {
            const { data } = await axiosInstance.post<Producto>(
                '/productos',
                formData
            );
            return data;
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['productos'] });
            showNotification('Producto creado exitosamente', 'success');
        },
        onError: (err: unknown) => {
            showNotification(
                handleApiError(err, 'Error al crear el producto'),
                'error'
            );
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({
            id,
            data: formData,
        }: {
            id: number;
            data: Partial<ProductoFormData>;
        }): Promise<Producto> => {
            const { data } = await axiosInstance.put<Producto>(
                `/productos/${id}`,
                formData
            );
            return data;
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['productos'] });
            showNotification('Producto actualizado exitosamente', 'success');
        },
        onError: (err: unknown) => {
            showNotification(
                handleApiError(err, 'Error al actualizar el producto'),
                'error'
            );
        },
    });

    const updateStockMutation = useMutation({
        mutationFn: async ({
            id,
            data: stockData,
        }: {
            id: number;
            data: ProductoStockUpdate;
        }): Promise<Producto> => {
            const { data } = await axiosInstance.patch<Producto>(
                `/productos/${id}/stock`,
                stockData
            );
            return data;
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['productos'] });
            showNotification('Stock y disponibilidad actualizados', 'success');
        },
        onError: (err: unknown) => {
            showNotification(
                handleApiError(err, 'Error al actualizar el stock'),
                'error'
            );
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number): Promise<void> => {
            await axiosInstance.delete(`/productos/${id}`);
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['productos'] });
            showNotification('Producto dado de baja exitosamente', 'success');
        },
        onError: (err: unknown) => {
            showNotification(
                handleApiError(err, 'Error al eliminar el producto'),
                'error'
            );
        },
    });

    return {
        productos: query.data?.items ?? [],
        total: query.data?.total ?? 0,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
        createProducto: createMutation.mutateAsync,
        updateProducto: updateMutation.mutateAsync,
        updateStockProducto: updateStockMutation.mutateAsync,
        deleteProducto: deleteMutation.mutateAsync,
    };
};