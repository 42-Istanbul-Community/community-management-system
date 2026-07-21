CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE community_status AS ENUM (
    'active',
    'inactive'
);

CREATE TYPE community_visibility AS ENUM (
    'public',
    'private'
);

CREATE TYPE community_access AS ENUM (
    'open',
    'restricted',
    'closed'
);

CREATE TYPE request_status AS ENUM (
    'pending',
    'approved',
    'rejected'
);

CREATE TABLE IF NOT EXISTS communities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(128) NOT NULL,
    slug VARCHAR(128) NOT NULL UNIQUE,
    rules_path VARCHAR(256) DEFAULT NULL,
    description TEXT,
    status community_status NOT NULL DEFAULT 'active',
    visibility community_visibility NOT NULL DEFAULT 'public',
    access community_access NOT NULL DEFAULT 'open',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(64) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS community_tags (
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (community_id, tag_id)
);

CREATE TABLE IF NOT EXISTS community_create_requests(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(128) NOT NULL,
    status request_status NOT NULL DEFAULT 'pending',
    user_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    rules_path VARCHAR(256) DEFAULT NULL,
    description TEXT,
    message TEXT,
    reviewed_by UUID NOT NULL,
    reviewed_at TIMESTAMPTZ DEFAULT NULL
);