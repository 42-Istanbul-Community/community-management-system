# Community Service

## endpoints

- `POST /communities` - Manage community requests (accept/reject)
- `GET /communities` - Get all communities
- `GET /communities/:slug` - Get a specific community by slug
- `PUT /communities/:slug` - Update a specific community by slug
- `DELETE /communities/:slug` - Delete a specific community by slug
- `POST /createCommunity` - Create a new community request

## Membership requesting endpoints

- `GET /isMember/:userid/:communityid` - Check if a user is a member of a community
- `GET /userCommunities/:userid` - Get all communities a user is a member of
- `GET /isAdmin/:userid/:communityid` - Check if a user is an admin of a community