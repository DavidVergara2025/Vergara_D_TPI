from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException, status

from app.core.deps import require_role
from app.modules.usuarios.schemas import UserPublic
from app.modules.usuarios.service import (
    AutoDesactivacionNoPermitida,
    UsuarioNoEncontrado,
    UsuarioService,
)
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork

router = APIRouter(prefix="/admin/usuarios", tags=["Usuarios"])


def get_usuario_service() -> UsuarioService:
    return UsuarioService(UsuarioUnitOfWork())


@router.get("", response_model=List[UserPublic])
def list_users(
    _admin: Annotated[UserPublic, Depends(require_role(["admin"]))],
    service: Annotated[UsuarioService, Depends(get_usuario_service)],
) -> List[UserPublic]:
    return service.listar()


@router.post("/{user_id}/activar", response_model=UserPublic)
def activate_user(
    user_id: int,
    _admin: Annotated[UserPublic, Depends(require_role(["admin"]))],
    service: Annotated[UsuarioService, Depends(get_usuario_service)],
) -> UserPublic:
    try:
        return service.set_disabled(user_id=user_id, disabled=False)
    except UsuarioNoEncontrado as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))


@router.post("/{user_id}/desactivar", response_model=UserPublic)
def deactivate_user(
    user_id: int,
    admin_user: Annotated[UserPublic, Depends(require_role(["admin"]))],
    service: Annotated[UsuarioService, Depends(get_usuario_service)],
) -> UserPublic:
    try:
        return service.set_disabled(
            user_id=user_id, disabled=True, current_admin_id=admin_user.id
        )
    except UsuarioNoEncontrado as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    except AutoDesactivacionNoPermitida as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))