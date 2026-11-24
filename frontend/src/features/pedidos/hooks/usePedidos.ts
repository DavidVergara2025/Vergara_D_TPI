import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { handleApiError } from '@/shared/api/handleApiError';
import { useNotificationStore } from '@/store/notificationStore';
import {
    cambiarEstadoPedidoApi,
    cancelarPedidoApi,
    crearPedidoApi,
    fetchPedidos,
    fetchResumenPedidos,
} from '../api/pedidos';
import type {
    EstadoPedido,
    PedidoCreateInput,
    PedidoFilters,
} from '../types';

export const usePedidos = (filters: PedidoFilters = { skip: 0, limit: 20 }) => {
    const query = useQuery({
        queryKey: ['pedidos', filters],
        queryFn: () => fetchPedidos(filters),
    });

    return {
        pedidos: query.data?.items ?? [],
        total: query.data?.total ?? 0,
        isLoading: query.isLoading,
        isError: query.isError,
        refetch: query.refetch,
    };
};

export const useCrearPedido = () => {
    const queryClient = useQueryClient();
    const showNotification = useNotificationStore((s) => s.showNotification);

    return useMutation({
        mutationFn: (payload: PedidoCreateInput) => crearPedidoApi(payload),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['pedidos'] });
            void queryClient.invalidateQueries({
                queryKey: ['pedidos-resumen'],
            });
            void queryClient.invalidateQueries({ queryKey: ['productos'] });
            showNotification('¡Pedido confirmado exitosamente!', 'success');
        },
        onError: (err: unknown) => {
            showNotification(
                handleApiError(err, 'No se pudo procesar el pedido'),
                'error'
            );
        },
    });
};

export const useCambiarEstadoPedido = () => {
    const queryClient = useQueryClient();
    const showNotification = useNotificationStore((s) => s.showNotification);

    return useMutation({
        mutationFn: ({
            pedidoId,
            estado,
        }: {
            pedidoId: number;
            estado: EstadoPedido;
        }) => cambiarEstadoPedidoApi(pedidoId, estado),
        onSuccess: (updated) => {
            void queryClient.invalidateQueries({ queryKey: ['pedidos'] });
            void queryClient.invalidateQueries({
                queryKey: ['pedidos-resumen'],
            });
            void queryClient.invalidateQueries({ queryKey: ['productos'] });
            showNotification(
                `Pedido #${updated.id} actualizado a ${updated.estado}`,
                'success'
            );
        },
        onError: (err: unknown) => {
            showNotification(
                handleApiError(err, 'Error al cambiar el estado del pedido'),
                'error'
            );
        },
    });
};

export const useCancelarPedido = () => {
    const queryClient = useQueryClient();
    const showNotification = useNotificationStore((s) => s.showNotification);

    return useMutation({
        mutationFn: (pedidoId: number) => cancelarPedidoApi(pedidoId),
        onSuccess: (updated) => {
            void queryClient.invalidateQueries({ queryKey: ['pedidos'] });
            void queryClient.invalidateQueries({
                queryKey: ['pedidos-resumen'],
            });
            void queryClient.invalidateQueries({ queryKey: ['productos'] });
            showNotification(
                `Pedido #${updated.id} cancelado y stock restituido`,
                'success'
            );
        },
        onError: (err: unknown) => {
            showNotification(
                handleApiError(err, 'No se pudo cancelar el pedido'),
                'error'
            );
        },
    });
};

export const useResumenPedidos = () => {
    return useQuery({
        queryKey: ['pedidos-resumen'],
        queryFn: fetchResumenPedidos,
    });
};