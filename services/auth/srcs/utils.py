from datetime import datetime, timedelta, UTC
from jose import jwt
import os

SERCRET_KEY = os.getenv("JWT_SECRET_KEY", "default_secret_key")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
EXPIRATION_TIME_DAYS = int(os.getenv("JWT_EXPIRATION_TIME_DAYS", 7))  # Default expiration time is 7 days

def create_jwt_token(user_id: int, user_role: str) -> str:
    expiration_time = datetime.now(UTC) + timedelta(days=EXPIRATION_TIME_DAYS)
    payload = {
        "user_id": user_id,
        "role": user_role,
        "exp": expiration_time
    }
    token = jwt.encode(payload, SERCRET_KEY, algorithm=ALGORITHM)
    return token