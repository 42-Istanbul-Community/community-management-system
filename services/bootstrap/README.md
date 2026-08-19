# Community Management System - Bootstrap Service

This service is responsible for initializing and setting up the Community Management System. It provides endpoints for bootstrapping the system, including creating initial users, roles, and other necessary configurations.

## Uses Endpoints

### batch endpoints (not ready currently)
- `POST /id/bootstrap`: Initializes the system with default configurations and creates initial users and roles.
- `POST /auth/bootstrap`: Sets up authentication configurations and creates initial admin users.

### single endpoints

- `POST /id/createUser`: Creates a new user in the system.
- `POST /auth/register`: Creates a new role in the system.