from fastapi import Response, status, Request
from uuid import UUID
import requests
import os

try:
    from .model import User, LoginRequest, EditUserRequest, LoginWithMailRequest
    from .utils import create_jwt_token
except ImportError:
    from srcs.model import User, LoginRequest, EditUserRequest, LoginWithMailRequest
    from srcs.utils import create_jwt_token


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
        role = requests.get(f"http://id/internal/{user.id}/role").json().get("role")
    except Exception as e:
        role = "normal"
    try:
        token = create_jwt_token(user.id, role)
    except Exception as e:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"error": "Failed to create token", "details": str(e)}

    return {"token": token}


async def register_user(item: LoginRequest, response: Response):
    user = User.get_user_by_email(email=item.email)
    if user:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {"error": "User already exists"}
    user = None
    try:
        is_existing_user = User.get_user_by_email(email=item.email)
        if is_existing_user:
            response.status_code = status.HTTP_400_BAD_REQUEST
            return {"error": "User already exists"}
        user = User.create_user(email=item.email, password=item.password)
    except Exception as e:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"error": "Failed to create user", "details": str(e)}
    return {"id": user.id}


async def get_user(user_id: UUID, request: Request, response: Response):
    user = User.get_user_by_id(user_id=user_id)
    if (
        request.state.user["id"] != str(user_id)
        and request.state.user["role"] != "super_admin"
    ):
        response.status_code = status.HTTP_403_FORBIDDEN
        return {"error": "Forbidden"}

    if not user:
        response.status_code = status.HTTP_404_NOT_FOUND
        return {"error": "User not found"}
    return {
        "id": user.id,
        "email": user.email,
    }


async def delete_user(request: Request, response: Response):
    try:
        user = User.get_user_by_id(user_id=UUID(request.path_params["user_id"]))
        if not user:
            response.status_code = status.HTTP_404_NOT_FOUND
            return {"error": "User not found"}
        user.delete()
    except Exception as e:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"error": "Failed to delete user", "details": str(e)}
    return {"message": "User deleted successfully"}


async def update_user(item: EditUserRequest, request: Request, response: Response):
    useridNum = None
    try:
        useridNum = UUID(request.state.user["id"])
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


async def login_with_mail(item: LoginWithMailRequest, response: Response):
    user = User.get_user_by_email(email=item.email)
    if not user:
        response.status_code = status.HTTP_404_NOT_FOUND
        return {"error": "User not found"}
    token = None
    role = None
    try:
        role = (
            requests.get(f"http://id/internal/{user.id}/role").json().get("role")
        )
    except Exception as e:
        role = "normal"
    try:
        token = create_jwt_token(user.id, role)
    except Exception as e:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"error": "Failed to create token", "details": str(e)}
    return {"token": token}
