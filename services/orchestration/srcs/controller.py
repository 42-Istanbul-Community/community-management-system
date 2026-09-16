import random
import httpx
import os
from fastapi import Response, Form, UploadFile, File, Request, status
from fastapi.responses import RedirectResponse

try:
    from .utils import create_exchange_token, get_exchange_token
except ImportError:
    from srcs.utils import create_exchange_token, get_exchange_token


async def register(
    response: Response,
    email: str = Form(...),
    password: str = Form(...),
    name: str = Form(...),
    picture: UploadFile | None = File(None),
    background_picture: UploadFile | None = File(None),
    picture_url: str | None = Form(None),
):
    try:
        async with httpx.AsyncClient() as client:
            authResponse: Response = await client.post(
                "http://auth/internal/register",
                json={"email": email, "password": password},
            )

            if authResponse.status_code != 201:
                response.status_code = authResponse.status_code
                return {
                    "service": "auth",
                    "status": "error",
                    "message": authResponse.json(),
                }

            try:
                files = []
                if isinstance(picture, UploadFile):
                    files.append(
                        (
                            "picture",
                            (picture.filename, picture.file, picture.content_type),
                        )
                    )
                if isinstance(background_picture, UploadFile):
                    files.append(
                        (
                            "background_picture",
                            (
                                background_picture.filename,
                                background_picture.file,
                                background_picture.content_type,
                            ),
                        )
                    )

                data_payload = {
                    "id": authResponse.json()["id"],
                    "name": name,
                }
                if picture_url is not None:
                    data_payload["picture_url"] = picture_url

                idResponse: Response = await client.post(
                    "http://id/internal/createUser",
                    data=data_payload,
                    files=files if files else None,
                )
                if idResponse.status_code != 201:
                    response.status_code = idResponse.status_code
                    await client.delete(
                        f"http://auth/internal/user/{authResponse.json()['id']}",
                    )
                    error_message = None
                    try:
                        error_message = idResponse.json()
                    except Exception:
                        error_message = idResponse.text
                    return {
                        "status": "error",
                        "service": "id",
                        "message": error_message,
                    }
            except Exception as e:
                await client.delete(
                    f"http://auth/internal/user/{authResponse.json()['id']}",
                )
                response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
                return {
                    "status": "error",
                    "service": "orchestration",
                    "message": str(e),
                }

        return {
            "status": "success",
            "message": "User registered successfully",
        }
    except Exception as e:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"status": "error", "service": "orchestration", "message": str(e)}


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

        client_secret = None
        client_id = None

        CLIENT_SECRET_FILE = os.environ.get("FT_CLIENT_SECRET_FILE", None)
        with open(CLIENT_SECRET_FILE) as f:
            client_secret = f.read().strip()

        CLIENT_ID_FILE = os.environ.get("FT_CLIENT_ID_FILE", None)
        with open(CLIENT_ID_FILE) as f:
            client_id = f.read().strip()

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
                response = RedirectResponse(
                    url=f"{frontend_url}/exchange?error=true&message=Failed to get access token&details={token_response.json()}"
                )
                return response
            access_token = token_response.json().get("access_token")
            if not access_token:
                response = RedirectResponse(
                    url=f"{frontend_url}/exchange?error=true&message=Failed to get access token"
                )
                return response

            user_info = None

            user_response = await client.get(
                "https://api.intra.42.fr/v2/me",
                headers={"Authorization": f"Bearer {access_token}"},
            )
            if user_response.status_code != 200:
                response = RedirectResponse(
                    url=f"{frontend_url}/exchange?error=true&message=Failed to get user info&details={user_response.json()}"
                )
                return response
            user_info = user_response.json()

            login_response = await client.post(
                "http://auth/internal/loginWithMail",
                json={"email": user_info.get("email")},
            )
            if login_response.status_code != 200 and login_response.status_code != 404:
                response = RedirectResponse(
                    url=f"{frontend_url}/exchange?error=true&message=Failed to login user&details={login_response.json()}"
                )
                return response

            if login_response.status_code != 404:

                token = create_exchange_token(login_response.json())

                response = RedirectResponse(
                    url=f"{frontend_url}/exchange?token={token}"
                )
                return response

            pic_url = (user_info.get("image") or {}).get("link") or user_info.get(
                "image_url"
            )
            data_payload = {
                "email": user_info.get("email"),
                "password": str(random.randint(1000, 9999))
                + "A"
                + str(user_info.get("login"))
                + str(random.randint(1000, 9999)),
                "name": user_info.get("displayname"),
            }
            if pic_url is not None:
                data_payload["picture_url"] = pic_url

            register_response = await client.post(
                "http://orchestration/register",
                data=data_payload,
            )
            if register_response.status_code != 201:
                response = RedirectResponse(
                    url=f"{frontend_url}/exchange?error=true&message=Failed to register user&details={register_response.json()}"
                )
                return response

            login_response = await client.post(
                "http://auth/internal/loginWithMail",
                json={"email": user_info.get("email")},
            )

            if login_response.status_code != 200:
                response = RedirectResponse(
                    url=f"{frontend_url}/exchange?error=true&message=Failed to login user after registration&details={login_response.json()}"
                )
                return response

        token = create_exchange_token(login_response.json())
        response = RedirectResponse(url=f"{frontend_url}/exchange?token={token}")
        return response
    except Exception as e:
        frontend_url = os.environ.get("FRONTEND_URL")
        if frontend_url:
            return RedirectResponse(url=f"{frontend_url}/exchange?error=true&message=Authentication failed")
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

        client_secret = None
        client_id = None

        CLIENT_SECRET_FILE = os.environ.get("GOOGLE_CLIENT_SECRET_FILE", None)
        with open(CLIENT_SECRET_FILE) as f:
            client_secret = f.read().strip()

        CLIENT_ID_FILE = os.environ.get("GOOGLE_CLIENT_ID_FILE", None)
        with open(CLIENT_ID_FILE) as f:
            client_id = f.read().strip()

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
        async with httpx.AsyncClient() as client:
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
                response = RedirectResponse(
                    url=f"{frontend_url}/exchange?error=true&message=Failed to get access token&details={access_token_response.json()}"
                )
                return response

            access_token = access_token_response.json().get("access_token")
            if not access_token:
                response = RedirectResponse(
                    url=f"{frontend_url}/exchange?error=true&message=Failed to get access token"
                )
                return response

            user_info_response = await client.get(
                "https://www.googleapis.com/oauth2/v1/userinfo",
                headers={"Authorization": f"Bearer {access_token}"},
            )
            if user_info_response.status_code != 200:
                response = RedirectResponse(
                    url=f"{frontend_url}/exchange?error=true&message=Failed to get user info&details={user_info_response.json()}"
                )
                return response
            user_info = user_info_response.json()

            login_response = await client.post(
                "http://auth/internal/loginWithMail",
                json={"email": user_info.get("email")},
            )
            if login_response.status_code != 200 and login_response.status_code != 404:
                response = RedirectResponse(
                    url=f"{frontend_url}/exchange?error=true&message=Failed to login user&details={login_response.json()}"
                )
                return response

            if login_response.status_code != 404:

                token = create_exchange_token(login_response.json())
                response = RedirectResponse(
                    url=f"{frontend_url}/exchange?token={token}"
                )

                return response

            pic_url = user_info.get("picture")
            data_payload = {
                "email": user_info.get("email"),
                "password": str(random.randint(1000, 9999))
                + "A"
                + str(user_info.get("email").split("@")[0])
                + str(random.randint(1000, 9999)),
                "name": user_info.get("name"),
            }
            if pic_url is not None:
                data_payload["picture_url"] = pic_url

            register_response = await client.post(
                "http://orchestration/register",
                data=data_payload,
            )
            if register_response.status_code != 201:
                response = RedirectResponse(
                    url=f"{frontend_url}/exchange?error=true&message=Failed to register user&details={register_response.json()}"
                )
                return response

            login_response = await client.post(
                "http://auth/internal/loginWithMail",
                json={"email": user_info.get("email")},
            )
            if login_response.status_code != 200:
                response = RedirectResponse(
                    url=f"{frontend_url}/exchange?error=true&message=Failed to login user after registration&details={login_response.json()}"
                )
                return response

        token = create_exchange_token(login_response.json())
        response = RedirectResponse(url=f"{frontend_url}/exchange?token={token}")
        return response
    except Exception as e:
        frontend_url = os.environ.get("FRONTEND_URL")
        if frontend_url:
            return RedirectResponse(url=f"{frontend_url}/exchange?error=true&message=Authentication failed")
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"status": "error", "message": str(e)}


async def manage_communities(request: Request, response: Response):
    try:
        if request.state.user["role"] != "super_admin":
            response.status_code = status.HTTP_403_FORBIDDEN
            return {"status": "error", "message": "Forbidden"}

        data = await request.json()
        async with httpx.AsyncClient() as client:
            cl_response = await client.post(
                "http://community/internal/communities",
                json=data,
            )

            if cl_response.status_code >= 300 or cl_response.status_code < 200:
                response.status_code = cl_response.status_code
                return {"status": "error", "message": cl_response.json()}

            cl_result = cl_response.json()

            communities = cl_result["communities"]
            errors = cl_result["errors"]

            communities = [
                {
                    "communityId": community["id"],
                    "adminId": community["user_id"],
                }
                for community in communities
            ]

            cl_response = await client.post(
                "http://membership/internal/createCommunity",
                json={"communities": communities},
            )

            if cl_response.status_code != 201:
                response.status_code = cl_response.status_code
                return {"status": "error", "message": cl_response.json()}

            if errors:
                response.status_code = status.HTTP_207_MULTI_STATUS
                return {
                    "status": "partial_success",
                    "message": "Some communities were not created successfully",
                    "success": communities,
                    "errors": errors,
                }

            return {
                "status": "ok",
                "message": "All communities created successfully",
                "success": communities,
            }

    except Exception as e:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"status": "error", "message": str(e)}


async def delete_user(user_id: str, request: Request, response: Response):
    try:
        if request.state.user["role"] != "super_admin":
            response.status_code = status.HTTP_403_FORBIDDEN
            return {"status": "error", "message": "Forbidden"}

        all_not_found = True

        async with httpx.AsyncClient() as client:
            services = [
                ("content", f"http://content/internal/user/{user_id}"),
                ("membership", f"http://membership/internal/user/{user_id}"),
                ("community", f"http://community/internal/user/{user_id}"),
                ("id", f"http://id/internal/{user_id}"),
                ("auth", f"http://auth/internal/user/{user_id}"),
            ]

            for service_name, url in services:
                service_response = await client.delete(url)

                if service_response.status_code == 200 and service_name in (
                    "id",
                    "auth",
                ):
                    all_not_found = False
                if service_response.status_code not in (200, 404):
                    response.status_code = service_response.status_code

                    return {
                        "status": "error",
                        "service": service_name,
                        "message": service_response.json(),
                    }

        if all_not_found:
            response.status_code = status.HTTP_404_NOT_FOUND
            return {
                "status": "error",
                "message": "User not found",
            }

        response.status_code = status.HTTP_200_OK
        return {
            "status": "ok",
            "message": "User deleted successfully",
        }

    except Exception as e:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR

        return {
            "status": "error",
            "message": str(e),
        }


async def delete_community(id: str, request: Request, response: Response):
    try:
        if request.state.user["role"] != "super_admin":
            response.status_code = status.HTTP_403_FORBIDDEN
            return {"status": "error", "message": "Forbidden"}

        async with httpx.AsyncClient() as client:
            community_response = await client.get(
                f"http://community/internal/communities/{id}"
            )

            if community_response.status_code != 200:
                response.status_code = community_response.status_code
                return {
                    "status": "error",
                    "message": community_response.json(),
                }

            community_id = community_response.json()["community"]["id"]

            services = [
                ("content", f"http://content/internal/community/{community_id}"),
                ("membership", f"http://membership/internal/community/{community_id}"),
            ]

            for service_name, url in services:
                service_response = await client.delete(url)

                if service_response.status_code not in (200, 404):
                    response.status_code = service_response.status_code
                    return {
                        "status": "error",
                        "service": service_name,
                        "message": service_response.json(),
                    }

            community_delete_response = await client.delete(
                f"http://community/internal/communities/{id}"
            )

            if community_delete_response.status_code not in (200, 404):
                response.status_code = community_delete_response.status_code
                return {
                    "status": "error",
                    "message": community_delete_response.json(),
                }

        return {
            "status": "ok",
            "message": "Community deleted successfully",
        }

    except Exception as e:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {
            "status": "error",
            "message": str(e),
        }


async def exchange_token(token: str, response: Response):
    try:
        code = token
        if not code:
            response.status_code = status.HTTP_400_BAD_REQUEST
            return {
                "status": "error",
                "message": "Missing token parameter in request body",
            }

        mytoken = get_exchange_token(code)
        if not mytoken:
            response.status_code = status.HTTP_400_BAD_REQUEST
            return {"status": "error", "message": "Invalid or expired token"}

        return {"status": "ok", **mytoken}

    except Exception as e:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"status": "error", "message": str(e)}


async def getCommunities(request: Request, response: Response):
    try:
        cursor = 0
        limit = 10
        status_val = None
        tags = None
        access = None
        visibility = None
        sort_by = "created_at"
        order = "desc"
        text = None

        try:
            cursor = int(request.query_params.get("cursor", 0))
            limit = int(request.query_params.get("limit", 10))
            status_val = request.query_params.get("status", None)
            tags = request.query_params.get("tags", None)
            access = request.query_params.get("access", None)
            sort_by = request.query_params.get("sort_by", "created_at")
            order = request.query_params.get("order", "desc")
            text = request.query_params.get("text", None)

            if sort_by and sort_by not in ["member_count", "created_at", "activity"]:
                raise ValueError("Invalid sort_by value")
            if order and order not in ["asc", "desc"]:
                raise ValueError("Invalid order value")
            if limit and (limit < 1 or limit > 250):
                raise ValueError("Invalid limit value")
            if cursor and cursor < 0:
                raise ValueError("Invalid cursor value")
            if status_val and status_val not in ["active", "inactive"]:
                raise ValueError("Invalid status value")
            if access and access not in ["open", "restricted", "closed"]:
                raise ValueError("Invalid access value")
            if tags:
                tags = [tag.strip() for tag in tags.split(",") if tag.strip()]
            if text and not isinstance(text, str):
                raise ValueError("Invalid text value")
        except Exception as e:
            response.status_code = status.HTTP_400_BAD_REQUEST
            return {"status": "error", "message": str(e)}

        chunk_size = 500
        communities = []
        currentCursor = cursor
        hasMore = True
        headers = {}
        if request.state.user:
            headers["X-User-ID"] = (
                request.state.user["id"] if request.state.user["id"] else ""
            )
            headers["X-User-Role"] = (
                request.state.user["role"] if request.state.user["role"] else ""
            )

        async with httpx.AsyncClient(headers=headers) as client:
            if sort_by == "created_at":
                community_response = await client.post(
                    f"http://community/internal/communities/batch",
                    json={
                        "cursor": currentCursor,
                        "limit": limit,
                        "status": status_val,
                        "tags": tags,
                        "access": access,
                        "text": text,
                        "order": order,
                    },
                )
                if community_response.status_code != 200:
                    response.status_code = community_response.status_code
                    return {
                        "status": "error",
                        "service": "community",
                        "message": community_response.json(),
                    }

                community_data = community_response.json().get("communities", [])
                communities.extend(community_data)

                if len(community_data) < limit:
                    hasMore = False
                currentCursor += len(community_data)

            elif sort_by == "activity":
                while len(communities) < limit:
                    content_response = await client.get(
                        f"http://content/internal/communities?cursor={currentCursor}&limit={chunk_size}&order={order}"
                    )

                    if content_response.status_code != 200:
                        response.status_code = content_response.status_code
                        return {
                            "status": "error",
                            "service": "content",
                            "message": content_response.json(),
                        }

                    content_data = content_response.json().get("communities", [])
                    if not content_data:
                        hasMore = False
                        break

                    community_response = await client.post(
                        f"http://community/internal/communities/batch",
                        json={
                            "ids": [
                                community["community_id"] for community in content_data
                            ],
                            "status": status_val,
                            "tags": tags,
                            "access": access,
                            "text": text,
                            "order": "desc",
                        },
                    )

                    if community_response.status_code != 200:
                        response.status_code = community_response.status_code
                        return {
                            "status": "error",
                            "service": "community",
                            "message": community_response.json(),
                        }

                    filtered_communities = community_response.json().get(
                        "communities", []
                    )

                    content_order = {
                        item["community_id"]: idx
                        for idx, item in enumerate(content_data)
                    }
                    filtered_communities.sort(
                        key=lambda x: content_order.get(x["id"], float("inf"))
                    )

                    needed = limit - len(communities)

                    if len(filtered_communities) > needed:
                        to_add = filtered_communities[:needed]
                        communities.extend(to_add)

                        last_added_id = to_add[-1]["id"]
                        for index, item in enumerate(content_data):
                            if item["community_id"] == last_added_id:
                                currentCursor += index + 1
                                break
                        break
                    else:
                        communities.extend(filtered_communities)
                        currentCursor += len(content_data)

                    if len(content_data) < chunk_size:
                        hasMore = False
                        break

            elif sort_by == "member_count":
                while len(communities) < limit:
                    membership_response = await client.get(
                        f"http://membership/internal/communities?cursor={currentCursor}&limit={chunk_size}&order={order}"
                    )

                    if membership_response.status_code != 200:
                        response.status_code = membership_response.status_code
                        return {
                            "status": "error",
                            "service": "membership",
                            "message": membership_response.json(),
                        }

                    membership_data = membership_response.json().get("communities", [])

                    if not membership_data:
                        hasMore = False
                        break

                    community_response = await client.post(
                        f"http://community/internal/communities/batch",
                        json={
                            "ids": [
                                community["community_id"]
                                for community in membership_data
                            ],
                            "status": status_val,
                            "tags": tags,
                            "access": access,
                            "text": text,
                            "order": "desc",
                            "visibility": visibility,
                        },
                    )

                    if community_response.status_code != 200:
                        response.status_code = community_response.status_code
                        return {
                            "status": "error",
                            "service": "community",
                            "message": community_response.json(),
                        }

                    filtered_communities = community_response.json().get(
                        "communities", []
                    )

                    membership_order = {
                        item["community_id"]: idx
                        for idx, item in enumerate(membership_data)
                    }
                    filtered_communities.sort(
                        key=lambda x: membership_order.get(x["id"], float("inf"))
                    )

                    needed = limit - len(communities)

                    if len(filtered_communities) > needed:
                        to_add = filtered_communities[:needed]
                        communities.extend(to_add)

                        last_added_id = to_add[-1]["id"]
                        for index, item in enumerate(membership_data):
                            if item["community_id"] == last_added_id:
                                currentCursor += index + 1
                                break
                        break
                    else:
                        communities.extend(filtered_communities)
                        currentCursor += len(membership_data)

                    if len(membership_data) < chunk_size:
                        hasMore = False
                        break

            else:
                response.status_code = status.HTTP_400_BAD_REQUEST
                return {
                    "status": "error",
                    "service": "orchestration",
                    "message": "Invalid sort_by value",
                }

        return {
            "status": "ok",
            "communities": communities,
            "nextCursor": currentCursor if hasMore else None,
        }

    except Exception as e:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {
            "status": "error",
            "service": "orchestration",
            "message": str(e),
        }
