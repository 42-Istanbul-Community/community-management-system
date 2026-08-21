# Community Management System - Auth Service

Auth service is a microservice that handles authentication and authorization for the Community Management System. It provides endpoints for user registration, login, and user management.

## Endpoints

/login - POST: Authenticates a user and returns a JWT token.
/internal/register - POST: Registers a new user.
/user/{user_id} - GET: Retrieves user information by user ID.
/user/{user_id} - PUT: Updates user information by user ID.
/internal/user/{user_id} - DELETE: Deletes a user by user ID.
/internal/loginWithEmail - POST: Authenticates a user using email, returns a JWT token.

## Resources

https://fastapi.tiangolo.com/tutorial/body/#import-pydantics-basemodel

https://docs.sqlalchemy.org/en/20/changelog/migration_20.html#migration-orm-usage

https://stackoverflow.com/questions/31684375/automatically-create-file-requirements-txt

https://www.geeksforgeeks.org/python/how-to-create-requirements-txt-file-in-python/

https://fastapi.tiangolo.com/advanced/response-change-status-code/#use-a-response-parameter

https://stackoverflow.com/questions/51426983/how-to-compare-hashed-passwords-stored-as-strings-in-python-using-bcrypt


## using packages

fastapi, uvicorn, python-jose, bcrypt, sqlalchemy, pydantic

## AI using

how to create a jwt token with vanillia python and python-jose library, how to connect to a postgresql database with sqlalchemy, import error handling