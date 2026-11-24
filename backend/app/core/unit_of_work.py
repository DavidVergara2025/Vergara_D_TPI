from typing import Callable, Optional
from sqlmodel import Session
from app.core.database import session_factory


class UnitOfWork:
    def __init__(
        self,
        session: Optional[Session] = None,
        factory: Callable[[], Session] = session_factory,
    ) -> None:
        self._external_session = session
        self._session_factory = factory
        self._session: Optional[Session] = session

    def __enter__(self) -> "UnitOfWork":
        if self._session is None:
            self._session = self._session_factory()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb) -> None:
        if self._session is None:
            return
        try:
            if exc_type is None:
                self._session.commit()
            else:
                self._session.rollback()
        finally:
            self._session.close()
            if self._external_session is None:
                self._session = None
