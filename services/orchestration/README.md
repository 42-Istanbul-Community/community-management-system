# Orchestration service of the Community Management System

This service is responsible for orchestrating the various components of the Community Management System, ensuring smooth communication and coordination between different services.

## Endpoints

- `GET /`: Retrieve the current orchestration status.
- `POST /register`: Register a new user with the system. uses id and auth services to create a new user and store their information in the database.
- `GET /42/callback`: Handle the callback from the 42 API after user authentication. This endpoint processes the authentication response and retrieves user information.
- `GET /google/callback`: Handle the callback from Google OAuth after user authentication. This endpoint processes the authentication response and retrieves user information.
- `DELETE /communities/{slug}`: Delete a community by its slug.
- `DELETE /user/{user_id}`: Delete a user by their user ID.

## Needed Endpoints

### Register
- `POST auth/register`
- `POST auth/loginWithMail`
- `POST id/createUser`
- `DELETE auth/user/{user_id}`
- `POST orchestration/register` yes its needs to post to itself to register a user

### Manage Communities (Create)
- `POST community/communities`
- `POST membership/createCommunities`

### Delete User
- `DELETE content/user/{user_id}`
- `DELETE membership/user/{user_id}`
- `DELETE community/user/{user_id}`

### Delete Community
- `DELETE membership/community/{community_id}`
- `DELETE community/communities/{slug}`
- `DELETE content/community/{community_id}`

