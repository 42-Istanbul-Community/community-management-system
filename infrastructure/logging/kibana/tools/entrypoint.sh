#!/bin/sh

set -e

export ELASTICSEARCH_PASSWORD="$(cat "$ELASTICSEARCH_PASSWORD_FILE")"

exec "$@"