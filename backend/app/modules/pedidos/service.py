from datetime import datetime, timezone
from typing import Dict, Optional, Set

from app.modules.pedidos.models import DetallePedido, Pedido
from app.modules.pedidos.schemas import (
    CambioEstado,
    PedidoCreate,
    PedidoRead,
    PedidosPaginados,
    ResumenPedidos,
)
from app.modules.pedidos.unit_of_work import PedidoUnitOfWork
from app.modules.productos.service import ProductoNoEncontrado
from app.modules.usuarios.schemas import UserPublic

TRANSICIONES_VALIDAS: Dict[str, Set[str]] = {
    "PENDIENTE": {"EN_PREPARACION", "CANCELADO"},
    "EN_PREPARACION": {"ENTREGADO", "CANCELADO"},
    "ENTREGADO": set(),
    "CANCELADO": set(),
}


class PedidoNoEncontrado(Exception):
    def __init__(self, pedido_id: int) -> None:
        super().__init__(f"Pedido con id={pedido_id} no encontrado")


class PedidoAjeno(Exception):
    def __init__(self) -> None:
        super().__init__("No tienes permiso para acceder a un pedido de otro usuario")


class ProductoRepetido(Exception):
    def __init__(self, producto_id: int) -> None:
        super().__init__(
            f"El producto con id={producto_id} está repetido en el pedido"
        )


class ProductoNoDisponible(Exception):
    def __init__(self, nombre: str) -> None:
        super().__init__(f"El producto '{nombre}' no está disponible para la venta")


class StockInsuficiente(Exception):
    def __init__(self, nombre: str, stock_actual: int, solicitado: int) -> None:
        super().__init__(
            f"Stock insuficiente para '{nombre}' (disponible: {stock_actual}, solicitado: {solicitado})"
        )


class TransicionInvalida(Exception):
    def __init__(self, detail: str) -> None:
        super().__init__(detail)


class PedidoService:
    def __init__(self, uow: PedidoUnitOfWork) -> None:
        self.uow = uow

    def crear(self, usuario_id: int, data: PedidoCreate) -> PedidoRead:
        with self.uow as uow:
            if not data.items:
                raise TransicionInvalida("El pedido debe contener al menos un ítem")

            vistos: Set[int] = set()
            for item in data.items:
                if item.producto_id in vistos:
                    raise ProductoRepetido(item.producto_id)
                vistos.add(item.producto_id)

            now = datetime.now(timezone.utc)
            pedido = uow.pedidos.add(
                Pedido(
                    usuario_id=usuario_id,
                    estado="PENDIENTE",
                    forma_pago=data.forma_pago,
                    direccion_entrega=data.direccion_entrega.strip(),
                    notas=data.notas.strip() if data.notas else None,
                    total=0.0,
                    created_at=now,
                    updated_at=now,
                )
            )
            assert pedido.id is not None

            total_acumulado = 0.0
            for item in data.items:
                producto = uow.productos.get_activo_by_id(item.producto_id)
                if producto is None:
                    raise ProductoNoEncontrado(item.producto_id)

                if not producto.disponible:
                    raise ProductoNoDisponible(producto.nombre)

                if producto.stock < item.cantidad:
                    raise StockInsuficiente(
                        producto.nombre, producto.stock, item.cantidad
                    )

                producto.stock -= item.cantidad
                uow.productos.add(producto)

                subtotal = round(producto.precio_base * item.cantidad, 2)
                uow.pedidos.add_detalle(
                    DetallePedido(
                        pedido_id=pedido.id,
                        producto_id=producto.id,  # type: ignore[arg-type]
                        cantidad=item.cantidad,
                        nombre_producto=producto.nombre,
                        precio_unitario=producto.precio_base,
                        subtotal=subtotal,
                    )
                )
                total_acumulado += subtotal

            pedido.total = round(total_acumulado, 2)
            pedido_actualizado = uow.pedidos.add(pedido)
            return PedidoRead.model_validate(pedido_actualizado)

    def listar(
        self,
        current_user: UserPublic,
        skip: int = 0,
        limit: int = 20,
        estado: Optional[str] = None,
    ) -> PedidosPaginados:
        with self.uow as uow:
            filtro_usuario = (
                None if current_user.role == "admin" else current_user.id
            )
            total, pedidos = uow.pedidos.list_by_usuario(
                skip=skip,
                limit=limit,
                usuario_id=filtro_usuario,
                estado=estado,
            )
            items = [PedidoRead.model_validate(p) for p in pedidos]
            return PedidosPaginados(total=total, items=items)

    def obtener(self, pedido_id: int, current_user: UserPublic) -> PedidoRead:
        with self.uow as uow:
            pedido = uow.pedidos.get_by_id(pedido_id)
            if pedido is None:
                raise PedidoNoEncontrado(pedido_id)

            if (
                current_user.role != "admin"
                and pedido.usuario_id != current_user.id
            ):
                raise PedidoAjeno()

            return PedidoRead.model_validate(pedido)

    def _restituir_stock(self, uow: PedidoUnitOfWork, pedido: Pedido) -> None:
        for linea in pedido.items:
            producto = uow.productos.get_by_id(linea.producto_id)
            if producto is not None:
                producto.stock += linea.cantidad
                uow.productos.add(producto)

    def cambiar_estado(self, pedido_id: int, data: CambioEstado) -> PedidoRead:
        with self.uow as uow:
            pedido = uow.pedidos.get_by_id(pedido_id)
            if pedido is None:
                raise PedidoNoEncontrado(pedido_id)

            permitidos = TRANSICIONES_VALIDAS.get(pedido.estado, set())
            if data.estado not in permitidos:
                raise TransicionInvalida(
                    f"Transición inválida de '{pedido.estado}' a '{data.estado}'"
                )

            if data.estado == "CANCELADO":
                self._restituir_stock(uow, pedido)

            pedido.estado = data.estado
            pedido.updated_at = datetime.now(timezone.utc)
            actualizado = uow.pedidos.add(pedido)
            return PedidoRead.model_validate(actualizado)

    def cancelar_propio(
        self, pedido_id: int, current_user: UserPublic
    ) -> PedidoRead:
        with self.uow as uow:
            pedido = uow.pedidos.get_by_id(pedido_id)
            if pedido is None:
                raise PedidoNoEncontrado(pedido_id)

            if (
                current_user.role != "admin"
                and pedido.usuario_id != current_user.id
            ):
                raise PedidoAjeno()

            if pedido.estado != "PENDIENTE":
                raise TransicionInvalida(
                    "Solo se puede cancelar un pedido en estado PENDIENTE"
                )

            self._restituir_stock(uow, pedido)
            pedido.estado = "CANCELADO"
            pedido.updated_at = datetime.now(timezone.utc)
            actualizado = uow.pedidos.add(pedido)
            return PedidoRead.model_validate(actualizado)

    def obtener_resumen(self) -> ResumenPedidos:
        with self.uow as uow:
            return uow.pedidos.count_by_estado()