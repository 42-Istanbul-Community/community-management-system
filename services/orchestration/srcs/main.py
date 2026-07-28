from requests import Response
import httpx
from fastapi import FastAPI, status
from models import RegisterRequest


app = FastAPI()


@app.get("/")
def health():
    return {
        "service": "orchestration",
        "status": "ok"
    }

@app.post("/register", status_code=status.HTTP_201_CREATED)
async def register(item: RegisterRequest, response: Response):
    async with httpx.AsyncClient() as client:
        authResponse: Response = await client.post(
            "http://auth:8000/register",
            data={
                "email": item.email,
                "password": item.password
            },
        )

    if authResponse.status_code != 201:
        response.status_code = authResponse.status_code
        return {
            "service": "auth",
            "status": "error",
            "message": authResponse.json()
        }

    #* send the request to the id service
    async with httpx.AsyncClient() as client:
        idResponse: Response = await client.post(
            "http://id:3000/register",
            data={
                "id": authResponse.json()["id"],
                "email": item.email,
                "name": item.name
            },
            files={"picture": (item.picture.filename, item.picture.file, item.picture.content_type)} if item.picture else None
        )

    if idResponse.status_code != 201:
        response.status_code = idResponse.status_code
        authResponse = await client.delete(
            f"http://auth:8000/{authResponse.json()['id']}",
        )
        return {
            "status": "error",
            "service":"id",
            "message": idResponse.json()
        }
