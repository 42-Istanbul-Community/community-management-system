# Community Management System - Identity Service

id service is responsible for managing user identities, authentication, and authorization within the Community Management System. It provides endpoints for user registration, login, profile management, and role-based access control.

## Endpoints

- `GET /` - Get user details (requires authentication)
- `GET /:userId` - Get user details by user ID (requires authentication)
- `PUT /:userId` - Update user details by user ID (requires authentication)
- `GET /internal/:userId/role` - Get user role by user ID
- `POST /internal/createUser` - Create a new user
- `DELETE /internal/:userId` - Delete a user by user ID 

## Resources

https://www.prisma.io/docs/orm/next
https://www.prisma.io/docs/orm/prisma-schema/overview
https://www.prisma.io/docs/orm/reference/prisma-config-reference