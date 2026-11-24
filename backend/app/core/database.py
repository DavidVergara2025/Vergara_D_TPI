from typing import Generator
from sqlmodel import Session, SQLModel, create_engine
from app.core.config import settings


def _normalize_db_url(url: str) -> str:
    if url.startswith("postgresql://"):
        return url.replace("postgresql://", "postgresql+psycopg://", 1)
    return url


DATABASE_URL = _normalize_db_url(settings.DATABASE_URL)
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, echo=False, connect_args=connect_args)


def session_factory() -> Session:
    return Session(engine, expire_on_commit=False)


def get_session() -> Generator[Session, None, None]:
    with session_factory() as session:
        yield session


def create_all_tables() -> None:
    SQLModel.metadata.create_all(engine)
