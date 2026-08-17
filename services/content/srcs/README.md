# Community Management System - Content Service

Content service is a microservice that manages the content of communities within the Community Management System. It handles announcements, events, and event participation, including file attachments, visibility rules, and capacity control.

## Authentication

Identity is passed by the gateway through the `X-User-ID` and `X-User-Role` headers (JWT is verified at the gateway, not in this service).

- Write operations (POST, PUT, DELETE, join, leave) require `X-User-ID`. Missing it returns `401 Unauthorized`.
- Read operations (list, get, list participants) are public. Anonymous viewers can only see content with `all` visibility.

## Endpoints

### Announcements
- `POST /announcements` — Creates a new announcement (author taken from `X-User-ID`). Accepts `application/json` or `multipart/form-data`; an optional `file` field attaches a file.
- `GET /announcements?communityId={id}` — Lists announcements of a community (filtered by the viewer's visibility rights). Supports `page` and `limit` query params.
- `GET /announcements/{id}` — Retrieves a single announcement by ID.
- `PUT /announcements/{id}` — Updates an announcement. Sending a `file` replaces the attachment; sending `removeAttachment=true` removes it; sending neither keeps the current attachment.
- `DELETE /announcements/{id}` — Deletes an announcement and its attached files.

### Events
- `POST /events` — Creates a new event (`endAt` is required; `endAt` cannot be before `startAt`). Accepts an optional `file` attachment. `capacity` of 0 means unlimited.
- `GET /events?communityId={id}` — Lists events of a community (filtered by visibility). Supports `page` and `limit`. Each event includes `isJoined` and `myStatus` for the current user.
- `GET /events/{id}` — Retrieves a single event by ID.
- `PUT /events/{id}` — Updates an event. Same attachment rules as announcements (`file` / `removeAttachment`).
- `DELETE /events/{id}` — Deletes an event and its attached files.

### Event Participants
- `POST /events/{id}/participants` — Joins the current user to an event. Rejects duplicates, enforces capacity, and rejects if the event has already ended.
- `DELETE /events/{id}/participants` — Removes the current user from an event. Rejects if the event has already ended.
- `GET /events/{id}/participants` — Lists the participants of an event.

## File Attachments

Attachments are accepted as `multipart/form-data` under the `file` field. Only file metadata (`url`, `name`, `type`, `size`) is stored in the database as JSONB; the binary is not stored in the database.

Until MinIO object storage is available, uploaded files are stored temporarily on local disk under `/uploads` and served statically from there. When MinIO is integrated, only the storage layer (`saveAttachment` / `deleteAttachments`) changes; the controllers and data model stay the same.

## Authorization & Visibility

- Update and delete operations are allowed for the content **author**, a **super_admin** (global role), or a **moderator/admin of the community**.
- Visibility levels (`all`, `community_page`, `member`, `moderator`) filter what a viewer can see; a viewer can see content whose required level is at or below their community role, plus their own content.
- `visibility` can be set on create and update. It defaults to `member`.
- Community-level membership and roles are resolved by calling the membership service.

## Inter-service dependency

Content queries the membership service to determine a user's role within a community: