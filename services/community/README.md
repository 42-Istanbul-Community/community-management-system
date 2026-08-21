# Community Service

Community management service for the Community Management System.

## endpoints


- `GET /communities` - Get all communities
- `GET /communities/:slug` - Get a specific community by slug
- `PUT /communities/:slug` - Update a specific community by slug
- `POST /createCommunity` - Create a new community request

### Private Endpoints (for service-to-service communication)

- `POST /internal/communities` - Manage community requests (accept/reject)
- `DELETE /internal/communities/:slug` - Delete a specific community by slug
- `DELETE /internal/user/:userid` - Delete a user and their memberships
- `GET /internal/communities/:slug` - Get a specific community by slug (internal use)

## Membership requesting endpoints

- `GET /internal/userRole/:userid/:communityid` - Check the role of a user in a specific community
- `GET /internal/userCommunities/:userid` - Get all communities a user is a member of
- `GET /internal/moderatorPermissions/:communityId` - Get the permissions of a moderator for a specific community

## Image Metadata:

- originalName: ??
- Size: ??
- Service: Community Service
- visibility: dynamic
- CommunitySlug: slug,