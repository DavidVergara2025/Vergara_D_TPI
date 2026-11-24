import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/shared/api/axiosInstance';
import { handleApiError } from '@/shared/api/handleApiError';
import { useNotificationStore } from '@/store/notificationStore';
import type { Categoria, CategoriaFormData } from '../types';

export const useCategories = () => {
    const queryClient = useQueryClient();
    const showNotification = useNotificationStore((s) => s.showNotification);

    const query = useQuery({
        queryKey: ['categorias'],
        queryFn: async (): Promise<Categoria[]> => {
            const { data } = await axiosInstance.get<Categoria[]>('/categorias');
            return data;
        },
    });

    const createMutation = useMutation({
        mutationFn: async (formData: CategoriaFormData): Promise<Categoria> => {
            const { data } = await axiosInstance.post<Categoria>(
                '/categorias',
                formData
            );
            return data;
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['categorias'] });
            showNotification('Categoría creada exitosamente', 'success');
        },
        onError: (err: unknown) => {
            showNotification(
                handleApiError(err, 'Error al crear la categoría'),
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
            data: CategoriaFormData;
        }): Promise<Categoria> => {
            const { data } = await axiosInstance.put<Categoria>(
                `/categorias/${id}`,
                formData
            );
            return data;
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['categorias'] });
            showNotification('Categoría actualizada exitosamente', 'success');
        },
        onError: (err: unknown) => {
            showNotification(
                handleApiError(err, 'Error al actualizar la categoría'),
                'error'
            );
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number): Promise<void> => {
            await axiosInstance.delete(`/categorias/${id}`);
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['categorias'] });
            showNotification('Categoría dada de baja exitosamente', 'success');
        },
        onError: (err: unknown) => {
            showNotification(
                handleApiError(err, 'Error al eliminar la categoría'),
                'error'
            );
        },
    });

    return {
        categorias: query.data ?? [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
        createCategoria: createMutation.mutateAsync,
        updateCategoria: updateMutation.mutateAsync,
        deleteCategoria: deleteMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
};