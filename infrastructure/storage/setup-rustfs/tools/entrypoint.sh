#!/bin/sh

set -e

RUSTFS_ACCESS_KEY=$(cat "$RUSTFS_ACCESS_KEY_FILE")
RUSTFS_SECRET_KEY=$(cat "$RUSTFS_SECRET_KEY_FILE")

CONTENT_ACCESS_KEY=$(cat "$RUSTFS_CONTENT_ACCESS_KEY_FILE")
CONTENT_SECRET_KEY=$(cat "$RUSTFS_CONTENT_SECRET_KEY_FILE")

ID_ACCESS_KEY=$(cat "$RUSTFS_ID_ACCESS_KEY_FILE")
ID_SECRET_KEY=$(cat "$RUSTFS_ID_SECRET_KEY_FILE")

COMMUNITY_ACCESS_KEY=$(cat "$RUSTFS_COMMUNITY_ACCESS_KEY_FILE")
COMMUNITY_SECRET_KEY=$(cat "$RUSTFS_COMMUNITY_SECRET_KEY_FILE")


until rc alias set rustfs \
    "http://rustfs:9000" \
    "$RUSTFS_ACCESS_KEY" \
    "$RUSTFS_SECRET_KEY"
do
    sleep 2
done

rc mb --ignore-existing rustfs/id-data
rc mb --ignore-existing rustfs/community-data
rc mb --ignore-existing rustfs/content-data

rc admin user add rustfs \
    "$CONTENT_ACCESS_KEY" \
    "$CONTENT_SECRET_KEY"

rc admin user add rustfs \
    "$ID_ACCESS_KEY" \
    "$ID_SECRET_KEY"

rc admin user add rustfs \
    "$COMMUNITY_ACCESS_KEY" \
    "$COMMUNITY_SECRET_KEY"

rc admin policy attach rustfs \
    readwrite \
    --user "$CONTENT_ACCESS_KEY"

rc admin policy attach rustfs \
    readwrite \
    --user "$ID_ACCESS_KEY"

rc admin policy attach rustfs \
    readwrite \
    --user "$COMMUNITY_ACCESS_KEY"