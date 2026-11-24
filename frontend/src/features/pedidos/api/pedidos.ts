import { axiosInstance } from '@/shared/api/axiosInstance';
import type {
    EstadoPedido,
    Pedido,
    PedidoCreateInput,
    PedidoFilters,
    PedidosPaginados,
    ResumenPedidos,
} from '../types';

export async function fetchPedidos(
    filters: PedidoFilters = {}
): Promise<PedidosPaginados> {
    const params: Record<string, string | number> = {
        skip: filters.skip ?? 0,
        limit: filters.limit ?? 20,
    };
    if (filters.estado && filters.estado.trim()) {
        params.estado = filters.estado.trim();
    }
    const { data } = await axiosInstance.get<PedidosPaginados>('/pedidos', {
        params,
    });
    return data;
}

export async function crearPedidoApi(
    payload: PedidoCreateInput
): Promise<Pedido> {
    const { data } = await axiosInstance.post<Pedido>('/pedidos', payload);
    return data;
}

export async function cambiarEstadoPedidoApi(
    pedidoId: number,
    estado: EstadoPedido
): Promise<Pedido> {
    const { data } = await axiosInstance.patch<Pedido>(
        `/pedidos/${pedidoId}/estado`,
        { estado }
    );
    return data;
}

export async function cancelarPedidoApi(pedidoId: number): Promise<Pedido> {
    const { data } = await axiosInstance.patch<Pedido>(
        `/pedidos/${pedidoId}/cancelar`
    );
    return data;
}

export async function fetchResumenPedidos(): Promise<ResumenPedidos> {
    const { data } =
        await axiosInstance.get<ResumenPedidos>('/pedidos/resumen');
    return data;
}