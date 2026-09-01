from fastapi import FastAPI, status, Response, Form, UploadFile, File, Request, Body
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

try:
    from .controller import register
    from .controller import callback_42
    from .controller import callback_google
    from .controller import manage_communities
    from .controller import delete_user
    from .controller import delete_community
    from .controller import exchange_token
except ImportError:
    from srcs.controller import register
    from srcs.controller import callback_42
    from srcs.controller import callback_google
    from srcs.controller import manage_communities
    from srcs.controller import delete_user
    from srcs.controller import delete_community
    from srcs.controller import exchange_token


app.add_middleware(
    CORSMiddleware,
    allow_origins=(
        os.environ.get("DOMAIN_NAME") if f".{os.environ.get('DOMAIN_NAME')}" else ["*"]
    ),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def auth_middleware(request: Request, call_next):
    id = request.headers.get("X-User-ID")
    role = request.headers.get("X-User-Role")

    request.state.user = {"id": id, "role": role}

    response = await call_next(request)
    return response


@app.get("/")
def health():
    return {"service": "orchestration", "status": "ok"}


@app.post("/register", status_code=status.HTTP_201_CREATED)
async def register_route(
    response: Response,
    email: str = Form(...),
    password: str = Form(...),
    name: str = Form(...),
    picture: UploadFile | None = File(None),
    picture_url: str | None = Form(None),
):
    return await register(response, email, password, name, picture, picture_url)


@app.get("/42/callback")
async def callback_42_route(request: Request, response: Response):
    return await callback_42(request, response)


@app.get("/google/callback")
async def callback_google_route(request: Request, response: Response):
    return await callback_google(request, response)


@app.post("/manage_communities", status_code=status.HTTP_201_CREATED)
async def manage_communities_route(request: Request, response: Response):
    return await manage_communities(request, response)


@app.delete("/user/{user_id}", status_code=status.HTTP_200_OK)
async def delete_user_route(user_id: str, request: Request, response: Response):
    return await delete_user(user_id, request, response)


@app.delete("/communities/{slug}", status_code=status.HTTP_200_OK)
async def delete_community_route(slug: str, request: Request, response: Response):
    return await delete_community(slug, request, response)


@app.get("/exchange", status_code=status.HTTP_200_OK)
async def exchange_token_route(
    response: Response,
    token: str = Body(..., embed=True),
):
    return await exchange_token(token, response)
