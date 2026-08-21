#!/bin/sh

set -e

MINIO_ROOT_PASSWORD=$(cat "$MINIO_ROOT_PASSWORD_FILE")
CONTENT_ACCESS_KEY=$(cat "$MINIO_CONTENT_ACCESS_KEY_FILE")
CONTENT_SECRET_KEY=$(cat "$MINIO_CONTENT_SECRET_KEY_FILE")
ID_ACCESS_KEY=$(cat "$MINIO_ID_ACCESS_KEY_FILE")
ID_SECRET_KEY=$(cat "$MINIO_ID_SECRET_KEY_FILE")
COMMUNITY_ACCESS_KEY=$(cat "$MINIO_COMMUNITY_ACCESS_KEY_FILE")
COMMUNITY_SECRET_KEY=$(cat "$MINIO_COMMUNITY_SECRET_KEY_FILE")

until mc alias set minio \
    "http://minio:9000" \
    "$MINIO_ROOT_USER" \
    "$MINIO_ROOT_PASSWORD"
do
    sleep 2
done

mc mb --ignore-existing minio/id-data
mc mb --ignore-existing minio/community-data
mc mb --ignore-existing minio/content-data

mc admin user add minio content-service "$CONTENT_ACCESS_KEY" "$CONTENT_SECRET_KEY"
mc admin user add minio id-service "$ID_ACCESS_KEY" "$ID_SECRET_KEY"
mc admin user add minio community-service "$COMMUNITY_ACCESS_KEY" "$COMMUNITY_SECRET_KEY"

mc admin policy attach minio readwrite --user content-service
mc admin policy attach minio readwrite --user id-service
mc admin policy attach minio readwrite --user community-service