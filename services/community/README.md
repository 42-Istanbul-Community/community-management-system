# Community Service

Komuniti servisi, kullanıcıların topluluklarla etkileşim kurmalarını ve bu topluluklarla ilgili bilgileri yönetmelerini sağlar.

## endpoints


- `GET /communities` - Bütün toplulukları listele burda filtreleme ve sayfalama yapılabilir
- `GET /communities/:slug` - Spesifik bir topluluğu slug ile getirir
- `PUT /communities/:slug` - Spesifik bir topluluğu günceller
- `POST /createCommunity` - Yeni bir topluluk için istek oluşturur

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
- Service: Community Service
- CommunitySlug: slug,