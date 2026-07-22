import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")  # Default to SQLite for local development

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(bind=engine)