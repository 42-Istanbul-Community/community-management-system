from fastapi import FastAPI, Response, status, Request
from pydantic import BaseModel
from uuid import UUID
import requests


try:
    from .database import init_db
    from .model import User
    from .utils import create_jwt_token
except ImportError:
    from srcs.database import init_db
    from srcs.model import User
    from srcs.utils import create_jwt_token

init_db()

class LoginRequest(BaseModel):
    email: str
    password: str

class EditUserRequest(BaseModel):
    email: str | None = None
    password: str | None = None


app = FastAPI()

@app.get("/")
def health():
    return {
        "service": "auth",
        "status": "ok"
    }

@app.post("/login", status_code=status.HTTP_200_OK)
async def login_user(item: LoginRequest, response: Response):
    user = User.get_user_by_email(email=item.email)
    if not user:
        response.status_code = status.HTTP_404_NOT_FOUND
        return {"error": "User not found"}
    
    if not user.check_password(item.password):
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return {"error": "Invalid credentials"}
    token = None
    role = None
    try:
        role = requests.get(f"http://id/user/{user.id}/role").json().get("role")
    except Exception as e:
        role = "normal"
    try:
        token = create_jwt_token(user.id, role)
    except Exception as e:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"error": "Failed to create token", "details": str(e)}
    return {"token": token}

@app.post("/register", status_code=status.HTTP_201_CREATED)
def register_user(item: LoginRequest, response: Response):
    user = User.get_user_by_email(email=item.email)
    if user:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {"error": "User already exists"}
    user = None
    try:
        user = User.create_user(email=item.email, password=item.password)
    except Exception as e:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"error": "Failed to create user", "details": str(e)}
    token = None
    role = "normal"
    try:
        token = create_jwt_token(user.id, role)
    except Exception as e:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"error": "Failed to create token", "details": str(e)}
    return {"token": token}

@app.get("/user/{user_id}", status_code=status.HTTP_200_OK)
def get_user(user_id: UUID, response: Response):
    user = User.get_user_by_id(user_id=user_id)
    if not user:
        response.status_code = status.HTTP_404_NOT_FOUND
        return {"error": "User not found"}
    return {
        "id": user.id,
        "email": user.email,
    }

@app.delete("/user/{user_id}", status_code=status.HTTP_200_OK)
def delete_user(user_id: UUID, request: Request, response: Response):
    user = User.get_user_by_id(user_id=user_id)
    if not user:
        response.status_code = status.HTTP_404_NOT_FOUND
        return {"error": "User not found"}
    try:
        if user.id != UUID(request.headers.get("X-User-ID")) and request.headers.get("X-User-Role") != "superadmin":
            response.status_code = status.HTTP_401_UNAUTHORIZED
            return {"error": "Unauthorized"}
    except Exception as e:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {"error": "Invalid user ID in header", "details": str(e)}

    try:
        user.delete()
    except Exception as e:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"error": "Failed to delete user", "details": str(e)}
    return {"message": "User deleted successfully"}

@app.put("/user/{user_id}", status_code=status.HTTP_200_OK)
def update_user(item: EditUserRequest, request: Request, response: Response):
    userid = request.headers.get("X-User-ID")
    if not userid:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return {"error": "Unauthorized"}
    useridNum = None
    try:
        useridNum = UUID(userid)
    except ValueError:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {"error": "Invalid user ID in header"}
    user = User.get_user_by_id(user_id=useridNum)
    if not user:
        response.status_code = status.HTTP_404_NOT_FOUND
        return {"error": "User not found"}
    if item.email:
        user.email = item.email
    if item.password:
        try:
            user.set_password(item.password)
        except Exception as e:
            response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
            return {"error": "Failed to set password", "details": str(e)}
    try:
        user.save()
    except Exception as e:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"error": "Failed to update user", "details": str(e)}
    return {
        "id": user.id,
        "email": user.email,
    }