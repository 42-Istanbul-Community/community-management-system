from fastapi import FastAPI, status, Request, Response

try:
    from .database import init_db
    from .model import LoginRequest, EditUserRequest
    from .controller import (
        login_user,
        register_user,
        get_user,
        delete_user,
        update_user,
        login_with_mail,
    )
except ImportError:
    from srcs.database import init_db
    from srcs.model import LoginRequest, EditUserRequest
    from srcs.controller import (
        login_user,
        register_user,
        get_user,
        delete_user,
        update_user,
        login_with_mail,
    )

init_db()

app = FastAPI()


@app.middleware("http")
async def auth_middleware(request: Request, call_next):
    id = request.headers.get("X-User-ID")
    role = request.headers.get("X-User-Role")

    request.state.user = {"id": id, "role": role}

    response = await call_next(request)
    return response


@app.get("/")
def health():
    return {"service": "auth", "status": "ok"}


@app.post("/login", status_code=status.HTTP_200_OK)
def login_route(item: LoginRequest, response: Response):
    return login_user(item, response)


@app.post("/internal/register", status_code=status.HTTP_201_CREATED)
def register_route(item: LoginRequest, response: Response):
    return register_user(item, response)


@app.get("/user/{user_id}", status_code=status.HTTP_200_OK)
def get_user_route(user_id: str, response: Response):
    return get_user(user_id, response)


@app.delete("/internal/user/{user_id}", status_code=status.HTTP_200_OK)
def delete_user_route(user_id: str, request: Request, response: Response):
    return delete_user(user_id, request, response)


@app.put("/user/{user_id}", status_code=status.HTTP_200_OK)
def update_user_route(item: EditUserRequest, request: Request, response: Response):
    return update_user(item, request, response)


@app.post("/internal/loginWithMail", status_code=status.HTTP_200_OK)
def login_with_mail_route(item: LoginRequest, response: Response):
    return login_with_mail(item, response)
