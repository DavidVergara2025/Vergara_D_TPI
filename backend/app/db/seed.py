from sqlmodel import Session, select
from app.core.database import create_all_tables, engine
from app.core.security import hash_password
from app.modules.categorias.models import Categoria
from app.modules.pedidos.models import DetallePedido, Pedido  # noqa: F401
from app.modules.productos.models import Producto
from app.modules.usuarios.models import Usuario


CATEGORIAS_SEED = [
    {
        "nombre": "Hamburguesas",
        "descripcion": "Hamburguesas caseras a la parrilla.",
    },
    {
        "nombre": "Pizzas",
        "descripcion": "Pizzas a la piedra de varios sabores.",
    },
    {
        "nombre": "Empanadas",
        "descripcion": "Empanadas artesanales horneadas con rellenos tradicionales.",
    },
    {
        "nombre": "Bebidas",
        "descripcion": "Gaseosas, aguas saborizadas y jugos naturales.",
    },
]

PRODUCTOS_SEED = [
    {
        "nombre": "Hamburguesa Clásica Cheddar",
        "descripcion": "Medallón de carne 180g, doble cheddar, panceta  y salsa especial.",
        "precio_base": 8500.0,
        "imagen_url": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",
        "stock": 25,
        "categoria": "Hamburguesas",
    },
    {
        "nombre": "Hamburguesa Doble Provoleta",
        "descripcion": "Doble medallón 180g, provoleta grillada, cebolla caramelizada y rúcula.",
        "precio_base": 10200.0,
        "imagen_url": "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600",
        "stock": 18,
        "categoria": "Hamburguesas",
    },
    {
        "nombre": "Hamburguesa Crispy Chicken",
        "descripcion": "Pechuga de pollo rebozada crocante, lechuga, tomate y mayonesa a elección.",
        "precio_base": 7900.0,
        "imagen_url": "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600",
        "stock": 20,
        "categoria": "Hamburguesas",
    },
    {
        "nombre": "Pizza Muzzarella Clásica",
        "descripcion": "Salsa de tomates naturales, abundante muzzarella, orégano y aceitunas verdes.",
        "precio_base": 11000.0,
        "imagen_url": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600",
        "stock": 15,
        "categoria": "Pizzas",
    },
    {
        "nombre": "Pizza Napolitana con Ajo",
        "descripcion": "Muzzarella, rodajas de tomate fresco, ajo picado, perejil y aceite de oliva.",
        "precio_base": 12500.0,
        "imagen_url": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600",
        "stock": 12,
        "categoria": "Pizzas",
    },
    {
        "nombre": "Pizza Fugazzeta Rellena",
        "descripcion": "Masa rellena con muzzarella y jamón, cubierta de cebolla dorada y parmesano.",
        "precio_base": 14200.0,
        "imagen_url": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600",
        "stock": 10,
        "categoria": "Pizzas",
    },
    {
        "nombre": "Docena de Empanadas Salteñas",
        "descripcion": "Carne cortada a cuchillo, papa, huevo duro, verdeo y comino.",
        "precio_base": 15600.0,
        "imagen_url": "https://images.unsplash.com/photo-1604467715878-83e57e8bc129?w=600",
        "stock": 20,
        "categoria": "Empanadas",
    },
    {
        "nombre": "Media Docena Jamón y Queso",
        "descripcion": "Empanadas rellenas de jamón cocido natural y abundante muzzarella.",
        "precio_base": 8200.0,
        "imagen_url": "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600",
        "stock": 30,
        "categoria": "Empanadas",
    },
    {
        "nombre": "Limonada Casera con Menta y Jengibre 1L",
        "descripcion": "Jugo exprimido de limones frescos, hojas de menta, jengibre y almíbar.",
        "precio_base": 4500.0,
        "imagen_url": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600",
        "stock": 40,
        "categoria": "Bebidas",
    },
    {
        "nombre": "Gaseosa Línea Cola 1.5L",
        "descripcion": "Botella familiar de 1.5 litros bien fría.",
        "precio_base": 3800.0,
        "imagen_url": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600",
        "stock": 50,
        "categoria": "Bebidas",
    },
]


def seed() -> None:
    create_all_tables()

    with Session(engine) as session:
        admin = session.exec(
            select(Usuario).where(Usuario.username == "admin")
        ).first()
        if admin is None:
            admin = Usuario(
                username="admin",
                full_name="Administrador Food Store",
                email="admin@foodstore.com",
                hashed_password=hash_password("Admin1234!"),
                role="admin",
                disabled=False,
            )
            session.add(admin)
            session.commit()
            print("Usuario admin creado: admin / Admin1234!")

        cliente = session.exec(
            select(Usuario).where(Usuario.username == "cliente")
        ).first()
        if cliente is None:
            cliente = Usuario(
                username="cliente",
                full_name="Cliente Demo",
                email="cliente@foodstore.com",
                hashed_password=hash_password("Cliente123!"),
                role="user",
                disabled=False,
            )
            session.add(cliente)
            session.commit()
            print("Usuario cliente creado: cliente / Cliente123!")

        mapa_categorias: dict[str, int] = {}
        for cat_data in CATEGORIAS_SEED:
            cat = session.exec(
                select(Categoria).where(Categoria.nombre == cat_data["nombre"])
            ).first()
            if cat is None:
                cat = Categoria(
                    nombre=cat_data["nombre"],
                    descripcion=cat_data["descripcion"],
                    activo=True,
                )
                session.add(cat)
                session.commit()
                session.refresh(cat)
            assert cat.id is not None
            mapa_categorias[cat.nombre] = cat.id

        for prod_data in PRODUCTOS_SEED:
            existente = session.exec(
                select(Producto).where(Producto.nombre == prod_data["nombre"])
            ).first()
            if existente is None:
                cat_id = mapa_categorias[prod_data["categoria"]]
                nuevo_prod = Producto(
                    nombre=prod_data["nombre"],
                    descripcion=prod_data["descripcion"],
                    precio_base=prod_data["precio_base"],
                    imagen_url=prod_data["imagen_url"],
                    stock=prod_data["stock"],
                    disponible=True,
                    activo=True,
                    categoria_id=cat_id,
                )
                session.add(nuevo_prod)
        session.commit()
        print("Seed completado exitosamente (admin, categorías y productos).")


if __name__ == "__main__":
    seed()