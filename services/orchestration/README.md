# Orchestration service of the Community Management System

This service is responsible for orchestrating the various components of the Community Management System, ensuring smooth communication and coordination between different services.

## Endpoints

- `GET /`: Retrieve the current orchestration status.
- `POST /register`: Register a new user with the system. uses id and auth services to create a new user and store their information in the database.
- `GET /42/callback`: Handle the callback from the 42 API after user authentication. This endpoint processes the authentication response and retrieves user information.
- `GET /google/callback`: Handle the callback from Google OAuth after user authentication. This endpoint processes the authentication response and retrieves user information.