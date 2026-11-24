from typing import Optional, Sequence
from sqlalchemy import func
from sqlmodel import Session, select
from app.core.base_repository import BaseRepository
from app.modules.categorias.models import Categoria


class CategoriaRepository(BaseRepository[Categoria]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Categoria)

    def get_by_nombre(self, nombre: str) -> Optional[Categoria]:
        statement = select(Categoria).where(
            func.lower(Categoria.nombre) == nombre.strip().lower()
        )
        return self.session.exec(statement).first()

    def get_activas(self) -> Sequence[Categoria]:
        statement = (
            select(Categoria)
            .where(Categoria.activo == True)  # noqa: E712
            .order_by(Categoria.id)
        )
        return self.session.exec(statement).all()

    def get_activa_by_id(self, categoria_id: int) -> Optional[Categoria]:
        categoria = self.get_by_id(categoria_id)
        if categoria is None or not categoria.activo:
            return None
        return categoria