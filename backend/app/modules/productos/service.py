from typing import Optional
from app.modules.categorias.service import CategoriaNoEncontrada
from app.modules.productos.models import Producto
from app.modules.productos.schemas import (
    ProductoCreate,
    ProductoRead,
    ProductosPaginados,
    ProductoStockUpdate,
    ProductoUpdate,
)
from app.modules.productos.unit_of_work import ProductoUnitOfWork


class ProductoNoEncontrado(Exception):
    def __init__(self, producto_id: int) -> None:
        super().__init__(f"Producto con id={producto_id} no encontrado")


class ProductoService:
    def __init__(self, uow: ProductoUnitOfWork) -> None:
        self.uow = uow

    def listar(
        self,
        skip: int = 0,
        limit: int = 20,
        search: Optional[str] = None,
        categoria_id: Optional[int] = None,
        disponible: Optional[bool] = None,
    ) -> ProductosPaginados:
        with self.uow as uow:
            total, productos = uow.productos.search(
                skip=skip,
                limit=limit,
                search=search,
                categoria_id=categoria_id,
                disponible=disponible,
            )
            items = [ProductoRead.model_validate(p) for p in productos]
            return ProductosPaginados(total=total, items=items)

    def obtener(self, producto_id: int) -> ProductoRead:
        with self.uow as uow:
            producto = uow.productos.get_activo_by_id(producto_id)
            if producto is None:
                raise ProductoNoEncontrado(producto_id)
            return ProductoRead.model_validate(producto)

    def crear(self, data: ProductoCreate) -> ProductoRead:
        with self.uow as uow:
            categoria = uow.categorias.get_activa_by_id(data.categoria_id)
            if categoria is None:
                raise CategoriaNoEncontrada(data.categoria_id)

            nuevo = Producto(
                nombre=data.nombre.strip(),
                descripcion=data.descripcion.strip(),
                precio_base=data.precio_base,
                imagen_url=data.imagen_url.strip(),
                stock=data.stock,
                disponible=data.disponible,
                categoria_id=data.categoria_id,
                activo=True,
            )
            creado = uow.productos.add(nuevo)
            return ProductoRead.model_validate(creado)

    def actualizar(self, producto_id: int, data: ProductoUpdate) -> ProductoRead:
        with self.uow as uow:
            producto = uow.productos.get_activo_by_id(producto_id)
            if producto is None:
                raise ProductoNoEncontrado(producto_id)

            campos = data.model_dump(exclude_unset=True)

            if "categoria_id" in campos and campos["categoria_id"] is not None:
                nueva_cat = uow.categorias.get_activa_by_id(campos["categoria_id"])
                if nueva_cat is None:
                    raise CategoriaNoEncontrada(campos["categoria_id"])
                producto.categoria_id = campos["categoria_id"]

            if "nombre" in campos and campos["nombre"] is not None:
                producto.nombre = campos["nombre"].strip()
            if "descripcion" in campos and campos["descripcion"] is not None:
                producto.descripcion = campos["descripcion"].strip()
            if "precio_base" in campos and campos["precio_base"] is not None:
                producto.precio_base = campos["precio_base"]
            if "imagen_url" in campos and campos["imagen_url"] is not None:
                producto.imagen_url = campos["imagen_url"].strip()
            if "stock" in campos and campos["stock"] is not None:
                producto.stock = campos["stock"]
            if "disponible" in campos and campos["disponible"] is not None:
                producto.disponible = campos["disponible"]

            actualizado = uow.productos.add(producto)
            return ProductoRead.model_validate(actualizado)

    def actualizar_stock(
        self, producto_id: int, data: ProductoStockUpdate
    ) -> ProductoRead:
        with self.uow as uow:
            producto = uow.productos.get_activo_by_id(producto_id)
            if producto is None:
                raise ProductoNoEncontrado(producto_id)

            producto.stock = data.stock
            producto.disponible = data.disponible
            actualizado = uow.productos.add(producto)
            return ProductoRead.model_validate(actualizado)

    def eliminar(self, producto_id: int) -> None:
        with self.uow as uow:
            producto = uow.productos.get_activo_by_id(producto_id)
            if producto is None:
                raise ProductoNoEncontrado(producto_id)

            producto.activo = False
            uow.productos.add(producto)