from typing import Optional, Sequence, Tuple
from sqlalchemy import func
from sqlmodel import Session, select
from app.core.base_repository import BaseRepository
from app.modules.productos.models import Producto


class ProductoRepository(BaseRepository[Producto]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Producto)

    def get_activo_by_id(self, producto_id: int) -> Optional[Producto]:
        producto = self.get_by_id(producto_id)
        if producto is None or not producto.activo:
            return None
        return producto

    def search(
        self,
        skip: int = 0,
        limit: int = 20,
        search: Optional[str] = None,
        categoria_id: Optional[int] = None,
        disponible: Optional[bool] = None,
    ) -> Tuple[int, Sequence[Producto]]:
        filters = [Producto.activo == True]  # noqa: E712

        if search and search.strip():
            termino = f"%{search.strip().lower()}%"
            filters.append(func.lower(Producto.nombre).like(termino))

        if categoria_id is not None:
            filters.append(Producto.categoria_id == categoria_id)

        if disponible is not None:
            filters.append(Producto.disponible == disponible)

        count_stmt = select(func.count()).select_from(Producto).where(*filters)
        total = int(self.session.exec(count_stmt).one())

        items_stmt = (
            select(Producto)
            .where(*filters)
            .order_by(Producto.id)
            .offset(skip)
            .limit(limit)
        )
        items = self.session.exec(items_stmt).all()
        return total, items