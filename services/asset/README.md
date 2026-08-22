# Community Management System - Asset Service

Asset Service is a microservice responsible for managing and serving assets related to users, communities, and content within the Community Management System. It provides endpoints to retrieve assets based on their unique identifiers.

## Endpoints

- `GET users/:assetID`
- `GET community/:assetID`
- `GET content/:assetID`

## Needed Enpoints

- `GET community/internal/communities/:slug` - Get a specific community by slug (internal use)
- `GET membership/internal/userRole/:userid/:communityid` - Check the role of a user in a specific community
- `GET content/internal/:contentID` - Get a specific content by contentID (internal use)

## Resources

- https://www.npmjs.com/package/@aws-sdk/client-s3