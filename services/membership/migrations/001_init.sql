CREATE EXTENSION IF NOT EXISTS pgcrypto;


CREATE TYPE member_role AS ENUM (
    'member',
    'moderator',
    'admin'
);

CREATE TYPE request_status AS ENUM (
    'pending',
    'approved',
    'rejected'
);

CREATE TABLE IF NOT EXISTS community_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id UUID NOT NULL,
    user_id UUID NOT NULL,
    role member_role NOT NULL DEFAULT 'member',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (community_id, user_id)
)

CREATE TABLE IF NOT EXISTS moderator_permissions (
    id: UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id UUID NOT NULL,
    permission jsonb NOT NULL,
    UNIQUE (community_id, permission)
)

CREATE TABLE IF NOT EXISTS community_join_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id UUID NOT NULL,
    user_id UUID NOT NULL,
    message TEXT,
    status request_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_by UUID DEFAULT NULL,
    reviewed_at TIMESTAMPTZ DEFAULT NULL,
    UNIQUE (community_id, user_id)
)