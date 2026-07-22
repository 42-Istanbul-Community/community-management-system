from sqlalchemy import select
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from database import SessionLocal
import bcrypt

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "user_auth"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(unique=True)
    password_hash: Mapped[str] = mapped_column(nullable=False)

    def check_password(self, password: str) -> bool:
        return bcrypt.checkpw(password.encode('utf8'), self.password_hash.encode('utf8'))
    
    def set_password(self, password: str) -> None:
        self.password_hash = bcrypt.hashpw(password.encode('utf8'), bcrypt.gensalt()).decode('utf8')

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
    def get_user_by_id(cls, user_id: int) -> "User | None":
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
