ALTER TABLE community_create_requests ADD COLUMN access community_access NOT NULL DEFAULT 'open';
ALTER TABLE community_create_requests ADD COLUMN visibility community_visibility NOT NULL DEFAULT 'public';

CREATE TABLE community_create_request_tags (
    request_id UUID REFERENCES community_create_requests(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (request_id, tag_id)
);