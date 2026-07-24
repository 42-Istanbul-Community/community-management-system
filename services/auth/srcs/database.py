import os
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

POSTGRES_AUTH_DB = os.environ.get("DB_NAME", "auth")
POSTGRES_USER = os.environ.get("DB_USER", "auth")
POSTGRES_PASSWORD_FILE = os.environ.get("DB_PASSWORD_FILE")

with open(POSTGRES_PASSWORD_FILE) as f:
    POSTGRES_PASSWORD = f.read().strip()

DATABASE_URL = (
    f"postgresql+psycopg://{POSTGRES_USER}:{POSTGRES_PASSWORD}"
    f"@postgres-auth/{POSTGRES_AUTH_DB}"
)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

class Base(DeclarativeBase):
    pass


def init_db() -> None:
    from srcs.model import User

    Base.metadata.create_all(bind=engine)