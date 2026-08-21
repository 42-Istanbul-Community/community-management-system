# Orchestration service of the Community Management System

This service is responsible for orchestrating the various components of the Community Management System, ensuring smooth communication and coordination between different services.

## Endpoints

- `GET /`: Retrieve the current orchestration status.
- `POST /register`: Register a new user with the system. uses id and auth services to create a new user and store their information in the database.
- `GET /42/callback`: Handle the callback from the 42 API after user authentication. This endpoint processes the authentication response and retrieves user information.
- `GET /google/callback`: Handle the callback from Google OAuth after user authentication. This endpoint processes the authentication response and retrieves user information.
- `POST /communities`: Manage community requests, including creating new communities or rejecting them. This endpoint interacts with the community service to perform community-related operations.
- `DELETE /communities/{slug}`: Delete a community by its slug.
- `DELETE /user/{user_id}`: Delete a user by their user ID.

## Needed Endpoints

### Register
- `POST auth/internal/register`
- `POST auth/internal/loginWithMail`
- `POST id/internal/createUser`
- `DELETE auth/internal/user/{user_id}`
- `POST orchestration/register` yes its needs to post to itself to register a user

### Manage Communities (Create)
- `POST community/internal/communities`
- `POST membership/internal/createCommunities`

### Delete User
- `DELETE content/internal/user/{user_id}`
- `DELETE membership/internal/user/{user_id}`
- `DELETE community/internal/user/{user_id}`

### Delete Community
- `DELETE membership/internal/community/{community_id}`
- `DELETE community/internal/communities/{slug}`
- `DELETE content/internal/community/{community_id}`

