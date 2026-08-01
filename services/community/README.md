# Community Service

## endpoints

- `POST /communities` - Manage community requests (accept/reject)
- `GET /communities` - Get all communities
- `GET /communities/:slug` - Get a specific community by slug
- `PUT /communities/:slug` - Update a specific community by slug
- `DELETE /communities/:slug` - Delete a specific community by slug
- `POST /createCommunity` - Create a new community request

## Membership requesting endpoints

- `GET /userRole/:userid/:communityid` - Check the role of a user in a specific community
- `GET /userCommunities/:userid` - Get all communities a user is a member of
- `GET /moderatorPermissions/:communityId` - Get the permissions of a moderator for a specific community