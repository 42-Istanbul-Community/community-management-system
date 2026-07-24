import os
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

POSTGRES_AUTH_DB = os.environ.get("POSTGRES_AUTH_DB", "auth")
POSTGRES_USER = os.environ.get("POSTGRES_USER", "auth")
POSTGRES_PASSWORD_FILE = os.environ.get("POSTGRES_PASSWORD_FILE")

with open(POSTGRES_PASSWORD_FILE) as f:
    POSTGRES_PASSWORD = f.read().strip()

DATABASE_URL = (
    f"postgresql+psycopg://{POSTGRES_USER}:{POSTGRES_PASSWORD}"
    f"@postgres-auth/{POSTGRES_AUTH_DB}"
)

connect_args = {"check_same_thread": False}
engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

class Base(DeclarativeBase):
    pass


def init_db() -> None:
    from srcs.model import User

    Base.metadata.create_all(bind=engine)