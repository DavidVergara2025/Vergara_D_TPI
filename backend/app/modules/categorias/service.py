from typing import List
from app.modules.categorias.models import Categoria
from app.modules.categorias.schemas import (
    CategoriaCreate,
    CategoriaRead,
    CategoriaUpdate,
)
from app.modules.categorias.unit_of_work import CategoriaUnitOfWork


class CategoriaNoEncontrada(Exception):
    def __init__(self, categoria_id: int) -> None:
        super().__init__(f"Categoría con id={categoria_id} no encontrada")


class NombreDuplicado(Exception):
    def __init__(self, nombre: str) -> None:
        super().__init__(f"Ya existe una categoría con el nombre '{nombre}'")


class CategoriaService:
    def __init__(self, uow: CategoriaUnitOfWork) -> None:
        self.uow = uow

    def listar(self) -> List[CategoriaRead]:
        with self.uow as uow:
            categorias = uow.categorias.get_activas()
            return [CategoriaRead.model_validate(c) for c in categorias]

    def obtener(self, categoria_id: int) -> CategoriaRead:
        with self.uow as uow:
            categoria = uow.categorias.get_activa_by_id(categoria_id)
            if categoria is None:
                raise CategoriaNoEncontrada(categoria_id)
            return CategoriaRead.model_validate(categoria)

    def crear(self, data: CategoriaCreate) -> CategoriaRead:
        with self.uow as uow:
            nombre_limpio = data.nombre.strip()
            if uow.categorias.get_by_nombre(nombre_limpio) is not None:
                raise NombreDuplicado(nombre_limpio)

            nueva = Categoria(
                nombre=nombre_limpio,
                descripcion=data.descripcion.strip(),
                activo=True,
            )
            creada = uow.categorias.add(nueva)
            return CategoriaRead.model_validate(creada)

    def actualizar(self, categoria_id: int, data: CategoriaUpdate) -> CategoriaRead:
        with self.uow as uow:
            categoria = uow.categorias.get_activa_by_id(categoria_id)
            if categoria is None:
                raise CategoriaNoEncontrada(categoria_id)

            campos = data.model_dump(exclude_unset=True)

            if "nombre" in campos and campos["nombre"] is not None:
                nuevo_nombre = campos["nombre"].strip()
                existente = uow.categorias.get_by_nombre(nuevo_nombre)
                if existente is not None and existente.id != categoria.id:
                    raise NombreDuplicado(nuevo_nombre)
                categoria.nombre = nuevo_nombre

            if "descripcion" in campos and campos["descripcion"] is not None:
                categoria.descripcion = campos["descripcion"].strip()

            actualizada = uow.categorias.add(categoria)
            return CategoriaRead.model_validate(actualizada)

    def eliminar(self, categoria_id: int) -> None:
        with self.uow as uow:
            categoria = uow.categorias.get_activa_by_id(categoria_id)
            if categoria is None:
                raise CategoriaNoEncontrada(categoria_id)

            categoria.activo = False
            uow.categorias.add(categoria)