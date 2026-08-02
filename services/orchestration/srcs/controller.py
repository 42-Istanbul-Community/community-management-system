import random
import httpx
from fastapi import Response, Form, UploadFile, File, Request, status
from fastapi.responses import RedirectResponse
import os


async def register(
    response: Response,
    email: str = Form(...),
    password: str = Form(...),
    name: str = Form(...),
    picture: UploadFile | None = File(None),
    picture_url: str | None = Form(None),
):
    async with httpx.AsyncClient() as client:
        authResponse: Response = await client.post(
            "http://auth:8000/register",
            json={"email": email, "password": password},
        )

        if authResponse.status_code != 201:
            response.status_code = authResponse.status_code
            return {
                "service": "auth",
                "status": "error",
                "message": authResponse.json(),
            }

        idResponse: Response = await client.post(
            "http://id:3000/createUser",
            data={
                "id": authResponse.json()["id"],
                "name": name,
                "picture_url": picture_url,
            },
            files=(
                {"picture": (picture.filename, picture.file, picture.content_type)}
                if picture
                else None
            ),
        )
        if idResponse.status_code != 201:
            response.status_code = idResponse.status_code
            authResponse = await client.delete(
                f"http://auth:8000/user/{authResponse.json()['id']}",
            )
            return {"status": "error", "service": "id", "message": idResponse.json()}

    return {
        "status": "ok",
        "message": "User registered successfully",
    }


async def callback_42(request: Request, response: Response):
    try:
        code = request.query_params.get("code")
        if not code:
            response.status_code = status.HTTP_400_BAD_REQUEST
            return {"status": "error", "message": "Missing code parameter"}
        state = request.query_params.get("state")
        if not state:
            response.status_code = status.HTTP_400_BAD_REQUEST
            return {"status": "error", "message": "Missing state parameter"}
        client_id = os.environ.get("42CLIENT_ID", None)
        client_secret = os.environ.get("42CLIENT_SECRET", None)
        redirect_uri = os.environ.get("42REDIRECT_URI", None)
        frontend_url = os.environ.get("FRONTEND_URL", None)
        base_domain = os.environ.get("BASE_DOMAIN", None)
        if (
            not client_id
            or not client_secret
            or not redirect_uri
            or not frontend_url
            or not base_domain
        ):
            response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
            return {
                "status": "error",
                "message": "Missing 42 API credentials or frontend URL or base domain",
            }
        grant_type = "authorization_code"

        login_response = None
        async with httpx.AsyncClient() as client:
            token_response = await client.post(
                "https://api.intra.42.fr/oauth/token",
                data={
                    "grant_type": grant_type,
                    "client_id": client_id,
                    "client_secret": client_secret,
                    "code": code,
                    "redirect_uri": redirect_uri,
                },
            )
            if token_response.status_code != 200:
                response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
                return {"status": "error", "message": "Failed to get access token"}
            access_token = token_response.json().get("access_token")
            if not access_token:
                response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
                return {"status": "error", "message": "Failed to get access token"}

            user_info = None

            user_response = await client.get(
                "https://api.intra.42.fr/v2/me",
                headers={"Authorization": f"Bearer {access_token}"},
            )
            if user_response.status_code != 200:
                response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
                return {"status": "error", "message": "Failed to get user info"}
            user_info = user_response.json()

            login_response = await client.post(
                "http://auth:8000/loginWithMail",
                json={"email": user_info.get("email")},
            )
            if login_response.status_code != 200 and login_response.status_code != 404:
                response.status_code = login_response.status_code
                return {"status": "error", "message": "Failed to login user"}

            if login_response.status_code != 404:
                response = RedirectResponse(url=f"{frontend_url}")

                response.set_cookie(
                    key="cms-token",
                    value=login_response.json().get("token"),
                    httponly=False,
                    secure=True,
                    samesite="lax",
                    domain=f".{base_domain}",
                )
                return response

            register_response = await client.post(
                "http://orchestration:8000/register",
                data={
                    "email": user_info.get("email"),
                    "password": str(random.randint(1000, 9999))
                    + user_info.get("login")
                    + str(random.randint(1000, 9999)),
                    "name": user_info.get("displayname"),
                    "picture": user_info.get("image_url"),
                },
            )
            if register_response.status_code != 201:
                response.status_code = register_response.status_code
                return {"status": "error", "message": "Failed to register user"}

            login_response = await client.post(
                "http://auth:8000/loginWithMail",
                json={"email": user_info.get("email")},
            )

            if login_response.status_code != 200:
                response.status_code = login_response.status_code
                return {
                    "status": "error",
                    "message": "Failed to login user after registration",
                }

        response = RedirectResponse(url=f"{frontend_url}")
        response.set_cookie(
            key="cms-token",
            value=login_response.json().get("token"),
            httponly=False,
            secure=True,
            samesite="lax",
            domain=f".{base_domain}",
        )
        return response
    except Exception as e:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"status": "error", "message": str(e)}


async def callback_google(request: Request, response: Response):
    try:
        code = request.query_params.get("code")
        if not code:
            response.status_code = status.HTTP_400_BAD_REQUEST
            return {"status": "error", "message": "Missing code parameter"}
        state = request.query_params.get("state")
        if not state:
            response.status_code = status.HTTP_400_BAD_REQUEST
            return {"status": "error", "message": "Missing state parameter"}

        client_id = os.environ.get("GOOGLE_CLIENT_ID", None)
        client_secret = os.environ.get("GOOGLE_CLIENT_SECRET", None)
        redirect_uri = os.environ.get("GOOGLE_REDIRECT_URI", None)
        frontend_url = os.environ.get("FRONTEND_URL", None)
        base_domain = os.environ.get("BASE_DOMAIN", None)
        if (
            not client_id
            or not client_secret
            or not redirect_uri
            or not frontend_url
            or not base_domain
        ):
            response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
            return {
                "status": "error",
                "message": "Missing Google API credentials or frontend URL or base domain",
            }

        login_response = None
        with httpx.AsyncClient() as client:
            access_token_response = await client.post(
                "https://oauth2.googleapis.com/token",
                data={
                    "code": code,
                    "client_id": client_id,
                    "client_secret": client_secret,
                    "redirect_uri": redirect_uri,
                    "grant_type": "authorization_code",
                },
            )

            if access_token_response.status_code != 200:
                response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
                return {"status": "error", "message": "Failed to get access token"}

            access_token = access_token_response.json().get("access_token")
            if not access_token:
                response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
                return {"status": "error", "message": "Failed to get access token"}

            user_info_response = await client.get(
                "https://www.googleapis.com/oauth2/v1/userinfo",
                headers={"Authorization": f"Bearer {access_token}"},
            )
            if user_info_response.status_code != 200:
                response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
                return {"status": "error", "message": "Failed to get user info"}
            user_info = user_info_response.json()

            login_response = await client.post(
                "http://auth:8000/loginWithMail",
                json={"email": user_info.get("email")},
            )
            if login_response.status_code != 200 and login_response.status_code != 404:
                response.status_code = login_response.status_code
                return {"status": "error", "message": "Failed to login user"}

            if login_response.status_code != 404:
                response = RedirectResponse(url=f"{frontend_url}")

                response.set_cookie(
                    key="cms-token",
                    value=login_response.json().get("token"),
                    httponly=False,
                    secure=True,
                    samesite="lax",
                    domain=f".{base_domain}",
                )
                return response

            register_response = await client.post(
                "http://orchestration:8000/register",
                data={
                    "email": user_info.get("email"),
                    "password": str(random.randint(1000, 9999))
                    + user_info.get("email").split("@")[0]
                    + str(random.randint(1000, 9999)),
                    "name": user_info.get("name"),
                    "picture_url": user_info.get("picture"),
                },
            )
            if register_response.status_code != 201:
                response.status_code = register_response.status_code
                return {"status": "error", "message": "Failed to register user"}

            login_response = await client.post(
                "http://auth:8000/loginWithMail",
                json={"email": user_info.get("email")},
            )
            if login_response.status_code != 200:
                response.status_code = login_response.status_code
                return {
                    "status": "error",
                    "message": "Failed to login user after registration",
                }

        response = RedirectResponse(url=f"{frontend_url}")
        response.set_cookie(
            key="cms-token",
            value=login_response.json().get("token"),
            httponly=False,
            secure=True,
            samesite="lax",
            domain=f".{base_domain}",
        )
        return response
    except Exception as e:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"status": "error", "message": str(e)}
