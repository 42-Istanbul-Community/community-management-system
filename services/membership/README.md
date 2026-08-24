# Membership Service

Community membership management service for the Community Management System.

## Endpoints

### Public Endpoints
- `POST /communityRequests` - Create a new community membership request
- `GET /communityRequests/:communityId` - Get all membership requests for a specific community
- `PUT /communityRequests/resolve` - Resolve a membership request (approve/reject)
- `GET /moderatorPermissions/:communityId` - Get the permissions of a moderator for a specific community
- `PUT /moderatorPermissions/:communityId` - Update the permissions of a moderator for a specific community
- `POST /kickMember` - Kick a member from a specific community
- `DELETE /leaveCommunity/:communityId` - Leave a specific community

### Private Endpoints
- `GET /internal/userRole/:userId/:communityId` - Check the role of a user in a specific community
- `GET /internal/userCommunities/:userId` - Get all communities a user is a member of
- `POST /internal/createCommunity` - Create a new community members
- `DELETE /internal/deleteCommunity/:communityId` - Delete a specific community by ID


## Moderator Permissions 
seeRequests
resolveRequests
kickMembers
setPermissions
setVisibility
setAccessibility
setDescription
setRules
setStatus