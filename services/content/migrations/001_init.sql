CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE content_visibility AS ENUM (
    'all',
    'community_page',
    'member',
    'moderator'
);

CREATE TYPE content_access AS ENUM (
    'all',
    'member',
    'moderator'
)

CREATE type event_participant_status AS ENUM (
    'requested',
    'joined',
    'no_show'
);

CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id UUID NOT NULL,
    author_id UUID NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    pinned BOOLEAN NOT NULL DEFAULT FALSE,
    attachments JSONB DEFAULT NULL,
    visibility content_visibility NOT NULL DEFAULT 'member',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id UUID NOT NULL,
    author_id UUID NOT NULL,
    capacity INT NOT NULL DEFAULT 0,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    attachments JSONB DEFAULT NULL,
    pinned_until TIMESTAMPTZ DEFAULT NULL,
    access content_access NOT NULL DEFAULT 'member',
    visibility content_visibility NOT NULL DEFAULT 'member',
    access_start_at TIMESTAMPTZ DEFAULT NULL,
    access_end_at TIMESTAMPTZ DEFAULT NULL,
    start_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
)

CREATE TABLE IF NOT EXISTS events_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID FOREIGN KEY REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    status event_participant_status NOT NULL DEFAULT 'requested',
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (event_id, user_id)
)