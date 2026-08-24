#!/bin/sh

set -e

export MINIO_ID_ACCESS_KEY="$(cat /run/secrets/minio_id_access_key)"
export MINIO_ID_SECRET_KEY="$(cat /run/secrets/minio_id_secret_key)"
export MINIO_COMMUNITY_ACCESS_KEY="$(cat /run/secrets/minio_community_access_key)"
export MINIO_COMMUNITY_SECRET_KEY="$(cat /run/secrets/minio_community_secret_key)"
export MINIO_CONTENT_ACCESS_KEY="$(cat /run/secrets/minio_content_access_key)"
export MINIO_CONTENT_SECRET_KEY="$(cat /run/secrets/minio_content_secret_key)"

cd ./srcs
npm install
cd ..

exec "$@"