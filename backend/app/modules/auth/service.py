from fastapi import HTTPException, status
from app.core.security import create_access_token, hash_password, verify_password
from app.modules.usuarios.models import Usuario
from app.modules.usuarios.schemas import UserCreate, UserPublic
from app.modules.usuarios.service import UsuarioDuplicado
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork


class AuthService:
    def __init__(self, uow: UsuarioUnitOfWork) -> None:
        self.uow = uow

    def register(self, data: UserCreate) -> UserPublic:
        with self.uow as uow:
            if uow.usuarios.get_by_username(data.username.strip()) is not None:
                raise UsuarioDuplicado("El nombre de usuario ya está registrado")

            if uow.usuarios.get_by_email(data.email.strip().lower()) is not None:
                raise UsuarioDuplicado("El correo electrónico ya está registrado")

            nuevo_usuario = Usuario(
                username=data.username.strip(),
                full_name=data.full_name.strip(),
                email=data.email.strip().lower(),
                hashed_password=hash_password(data.password),
                role="user",
                disabled=False,
            )
            creado = uow.usuarios.add(nuevo_usuario)
            return UserPublic.model_validate(creado)

    def login(self, username_or_email: str, password: str) -> str:
        with self.uow as uow:
            identifier = username_or_email.strip()
            user = uow.usuarios.get_by_username(identifier)
            if user is None:
                user = uow.usuarios.get_by_email(identifier.lower())

            if user is None or not verify_password(password, user.hashed_password):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Credenciales incorrectas",
                )

            if user.disabled:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Cuenta de usuario desactivada",
                )

            return create_access_token(
                data={"sub": user.username, "role": user.role}
            )