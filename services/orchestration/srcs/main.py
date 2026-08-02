from fastapi import FastAPI, status, Response, Form, UploadFile, File, Request

app = FastAPI()

try:
    from .controller import register
    from .controller import callback_42
    from .controller import callback_google
except ImportError:
    from srcs.controller import register
    from srcs.controller import callback_42
    from srcs.controller import callback_google


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
