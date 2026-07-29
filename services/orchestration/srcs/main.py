import httpx
from fastapi import FastAPI, status, Response, Form, UploadFile, File

app = FastAPI()


@app.get("/")
def health():
    return {"service": "orchestration", "status": "ok"}


@app.post("/register", status_code=status.HTTP_201_CREATED)
async def register(
    response: Response,
    email: str = Form(...),
    password: str = Form(...),
    name: str = Form(...),
    picture: UploadFile | None = File(None),
):
    async with httpx.AsyncClient() as client:
        authResponse: Response = await client.post(
            "http://auth:8000/register",
            json={"email": email, "password": password},
        )

        if authResponse.status_code != 201:
            response.status_code = authResponse.status_code
            return {"service": "auth", "status": "error", "message": authResponse.json()}

        idResponse: Response = await client.post(
            "http://id:3000/createUser",
            data={"id": authResponse.json()["id"], "name": name},
            files=(
                {"picture": (picture.filename, picture.file, picture.content_type)}
                if picture
                else None
            ),
        )
        print("test ",idResponse)
        print("test ",authResponse.json())
        if idResponse.status_code != 201:
            response.status_code = idResponse.status_code
            authResponse = await client.delete(
                f"http://auth:8000/user/{authResponse.json()['id']}",
            )
            return {"status": "error", "service": "id", "message": idResponse.json()}

    return {
        "service": "orchestration",
        "status": "ok",
        "message": "User registered successfully",
    }
