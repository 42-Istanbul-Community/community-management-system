from sqlalchemy import select
from sqlalchemy.orm import Mapped, mapped_column
import uuid
from sqlalchemy.dialects.postgresql import UUID
import bcrypt
from pydantic import BaseModel, EmailStr, field_validator
import re

try:
    from .database import Base, SessionLocal
except ImportError:
    from srcs.database import Base, SessionLocal


class LoginRequest(BaseModel):
    email: EmailStr
    password: str

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        if len(value) < 10:
            raise ValueError("Şifre en az 10 karakter olmalı")

        if not re.search(r"[A-Z]", value):
            raise ValueError("Şifre en az bir büyük harf içermeli")

        if not re.search(r"\d", value):
            raise ValueError("Şifre en az bir rakam içermeli")

        return value


class EditUserRequest(BaseModel):
    email: EmailStr | None = None
    password: str | None = None

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str | None) -> str | None:
        if value is None:
            return None

        if len(value) < 10:
            raise ValueError("Şifre en az 10 karakter olmalı")

        if not re.search(r"[A-Z]", value):
            raise ValueError("Şifre en az bir büyük harf içermeli")

        if not re.search(r"\d", value):
            raise ValueError("Şifre en az bir rakam içermeli")

        return value


class User(Base):
    __tablename__ = "user_auth"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    email: Mapped[str] = mapped_column(unique=True)
    password_hash: Mapped[str] = mapped_column(nullable=False)

    def check_password(self, password: str) -> bool:
        return bcrypt.checkpw(
            password.encode("utf8"), self.password_hash.encode("utf8")
        )

    def set_password(self, password: str) -> None:
        self.password_hash = bcrypt.hashpw(
            password.encode("utf8"), bcrypt.gensalt()
        ).decode("utf8")

    def save(self) -> None:
        with SessionLocal() as session:
            session.add(self)
            session.commit()

    @classmethod
    def get_user_by_email(cls, email: str) -> "User | None":
        with SessionLocal() as session:
            stmt = select(cls).where(cls.email == email)
            result = session.execute(stmt)
            return result.scalar_one_or_none()

    @classmethod
    def get_user_by_id(cls, user_id: UUID) -> "User | None":
        with SessionLocal() as session:
            stmt = select(cls).where(cls.id == user_id)
            result = session.execute(stmt)
            return result.scalar_one_or_none()

    @classmethod
    def create_user(cls, email: str, password: str) -> "User":
        user = cls(email=email)
        user.set_password(password)
        user.save()
        return user

    def delete(self) -> None:
        with SessionLocal() as session:
            session.delete(self)
            session.commit()
