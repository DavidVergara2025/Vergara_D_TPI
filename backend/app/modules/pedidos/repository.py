from datetime import datetime, timezone
from typing import Any, List, Optional, Sequence, Tuple
from sqlalchemy import func
from sqlmodel import Session, col, select
from app.core.base_repository import BaseRepository
from app.modules.pedidos.models import DetallePedido, Pedido
from app.modules.pedidos.schemas import ResumenPedidos


class PedidoRepository(BaseRepository[Pedido]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Pedido)

    def add_detalle(self, detalle: DetallePedido) -> DetallePedido:
        self.session.add(detalle)
        self.session.flush()
        self.session.refresh(detalle)
        return detalle

    def list_by_usuario(
        self,
        skip: int = 0,
        limit: int = 20,
        usuario_id: Optional[int] = None,
        estado: Optional[str] = None,
    ) -> Tuple[int, Sequence[Pedido]]:
        filters: List[Any] = []

        if usuario_id is not None:
            filters.append(col(Pedido.usuario_id) == usuario_id)

        if estado and estado.strip():
            filters.append(col(Pedido.estado) == estado.strip().upper())

        count_stmt = select(func.count()).select_from(Pedido)
        if filters:
            count_stmt = count_stmt.where(*filters)
        total = int(self.session.exec(count_stmt).one())

        items_stmt = select(Pedido)
        if filters:
            items_stmt = items_stmt.where(*filters)
        items_stmt = (
            items_stmt.order_by(col(Pedido.id).desc()).offset(skip).limit(limit)
        )
        items = self.session.exec(items_stmt).all()
        return total, items

    def count_by_estado(self) -> ResumenPedidos:
        def _count_estado(est: str) -> int:
            stmt = (
                select(func.count())
                .select_from(Pedido)
                .where(col(Pedido.estado) == est)
            )
            return int(self.session.exec(stmt).one())

        pendientes = _count_estado("PENDIENTE")
        en_preparacion = _count_estado("EN_PREPARACION")
        entregados = _count_estado("ENTREGADO")
        cancelados = _count_estado("CANCELADO")

        now_utc = datetime.now(timezone.utc)
        inicio_hoy = datetime(
            now_utc.year, now_utc.month, now_utc.day, tzinfo=timezone.utc
        )
        hoy_stmt = (
            select(func.count())
            .select_from(Pedido)
            .where(col(Pedido.created_at) >= inicio_hoy)
        )
        pedidos_hoy = int(self.session.exec(hoy_stmt).one())

        ingresos_stmt = select(func.coalesce(func.sum(col(Pedido.total)), 0.0)).where(
            col(Pedido.estado) == "ENTREGADO"
        )
        ingresos_entregados = float(self.session.exec(ingresos_stmt).one())

        return ResumenPedidos(
            pendientes=pendientes,
            en_preparacion=en_preparacion,
            entregados=entregados,
            cancelados=cancelados,
            pedidos_hoy=pedidos_hoy,
            ingresos_entregados=round(ingresos_entregados, 2),
        )