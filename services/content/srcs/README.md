# Community Management System - Content Service

Content service is a microservice that manages the content of communities within the Community Management System. It handles announcements, events, and event participation, including visibility rules and capacity control.

## Endpoints

### Announcements
/announcements - POST: Creates a new announcement (author taken from X-User-ID header).
/announcements?communityId={id} - GET: Lists announcements of a community (filtered by the viewer's visibility rights).
/announcements/{id} - GET: Retrieves a single announcement by ID.
/announcements/{id} - PUT: Updates an announcement (author or super_admin only).
/announcements/{id} - DELETE: Deletes an announcement (author or super_admin only).

### Events
/events - POST: Creates a new event (endAt is required; endAt cannot be before startAt).
/events?communityId={id} - GET: Lists events of a community (filtered by the viewer's visibility rights).
/events/{id} - GET: Retrieves a single event by ID.
/events/{id} - PUT: Updates an event (author or super_admin only).
/events/{id} - DELETE: Deletes an event (author or super_admin only).

### Event Participants
/events/{id}/participants - POST: Joins the current user (X-User-ID) to an event. Rejects duplicates and enforces capacity.
/events/{id}/participants - DELETE: Removes the current user from an event.
/events/{id}/participants - GET: Lists the participants of an event.

## Authorization & Visibility

- Identity is passed by the gateway through the X-User-ID and X-User-Role headers.
- Update and delete operations are allowed only for the content author or a super_admin.
- Visibility levels (all, community_page, member, moderator) filter what a viewer can see. Community-level membership and roles are resolved by calling the membership service.

## Inter-service dependency

Content queries the membership service to determine a user's role within a community:

GET http://membership:8000/userRole/{userId}/{communityId}
-> 200 { "role": "member" | "moderator" | "admin" } if the user is a member
-> 404 if the user is not a member

If the membership service is unreachable, the user is treated as a non-member (least privilege).

## Data model

Three tables managed via Prisma: announcements, events, and events_participants, backed by a dedicated PostgreSQL database. Enums: content_visibility, content_access, event_participant_status.

## Resources

https://expressjs.com/en/guide/routing.html
https://www.prisma.io/docs/orm/overview/databases/postgresql
https://www.prisma.io/docs/orm/prisma-client/queries/crud
https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

## using packages

express, cors, @prisma/client, @prisma/adapter-pg, pg, prisma

## AI using

how to set up prisma with a pg adapter and an existing database schema, how to write express route and controller structure, how to validate UUIDs and inputs, how to call another microservice with fetch and handle failures, how to filter content by visibility and role