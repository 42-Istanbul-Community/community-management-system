# Community Management System - Auth Service

Auth servisi kullanıcıların kimlik doğrulamasını ve yetkilendirmesini yönetmek için tasarlanmıştır. Bu servis, kullanıcıların giriş yapmasını, kayıt olmasını ve kullanıcı bilgilerini güncellemesini sağlar. Ayrıca, JWT (JSON Web Token) kullanarak güvenli bir şekilde kimlik doğrulaması yapar.

## Endpoints

- `POST /login`: Kullanıcıyı kimlik doğrular ve bir JWT token döndürür.
- `POST /internal/register`: Yeni bir kullanıcı kaydeder.
- `GET /user/{user_id}`: Kullanıcı ID'sine göre kullanıcı bilgilerini getirir.
- `PUT /user/{user_id}`: Kullanıcı ID'sine göre kullanıcı bilgilerini günceller.
- `DELETE /internal/user/{user_id}`: Kullanıcı ID'sine göre bir kullanıcı siler.
- `POST /internal/loginWithEmail`: E-posta kullanarak bir kullanıcıyı kimlik doğrular, bir JWT token döndürür.

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