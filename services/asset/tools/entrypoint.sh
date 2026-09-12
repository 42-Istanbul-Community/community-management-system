#!/bin/sh

set -e

export RUSTFS_ID_ACCESS_KEY="$(cat /run/secrets/rustfs_id_access_key)"
export RUSTFS_ID_SECRET_KEY="$(cat /run/secrets/rustfs_id_secret_key)"
export RUSTFS_COMMUNITY_ACCESS_KEY="$(cat /run/secrets/rustfs_community_access_key)"
export RUSTFS_COMMUNITY_SECRET_KEY="$(cat /run/secrets/rustfs_community_secret_key)"
export RUSTFS_CONTENT_ACCESS_KEY="$(cat /run/secrets/rustfs_content_access_key)"
export RUSTFS_CONTENT_SECRET_KEY="$(cat /run/secrets/rustfs_content_secret_key)"

cd ./srcs
npm install
cd ..

exec "$@"