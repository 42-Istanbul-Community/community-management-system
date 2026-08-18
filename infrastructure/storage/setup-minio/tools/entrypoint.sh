#!/bin/sh

set -e

MINIO_ROOT_PASSWORD=$(cat "$MINIO_ROOT_PASSWORD_FILE")

until mc alias set minio \
    "http://minio:9000" \
    "$MINIO_ROOT_USER" \
    "$MINIO_ROOT_PASSWORD"
do
    sleep 2
done

mc mb --ignore-existing minio/content