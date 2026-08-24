#!/bin/sh

set -e

export MINIO_ACCESS_KEY="$(cat /run/secrets/minio_id_access_key)"
export MINIO_SECRET_KEY="$(cat /run/secrets/minio_id_secret_key)"

cd ./srcs
npm install
cd ..

exec "$@"