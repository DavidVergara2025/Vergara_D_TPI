from typing import List
from app.modules.usuarios.schemas import UserPublic
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork


class UsuarioNoEncontrado(Exception):
    def __init__(self, user_id: int) -> None:
        super().__init__(f"Usuario con id={user_id} no encontrado")


class UsuarioDuplicado(Exception):
    def __init__(self, detail: str = "El username o email ya está registrado") -> None:
        super().__init__(detail)


class AutoDesactivacionNoPermitida(Exception):
    def __init__(self) -> None:
        super().__init__("No puedes desactivar tu propia cuenta de administrador")


class UsuarioService:
    def __init__(self, uow: UsuarioUnitOfWork) -> None:
        self.uow = uow

    def listar(self) -> List[UserPublic]:
        with self.uow as uow:
            usuarios = uow.usuarios.get_all()
            return [UserPublic.model_validate(u) for u in usuarios]

    def set_disabled(
        self, user_id: int, disabled: bool, current_admin_id: int | None = None
    ) -> UserPublic:
        with self.uow as uow:
            if disabled and current_admin_id is not None and user_id == current_admin_id:
                raise AutoDesactivacionNoPermitida()

            user = uow.usuarios.get_by_id(user_id)
            if user is None:
                raise UsuarioNoEncontrado(user_id)

            user.disabled = disabled
            uow.usuarios.add(user)
            return UserPublic.model_validate(user)