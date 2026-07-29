#!/bin/sh

set -e

export LOGSTASH_PASSWORD="$(cat "$ELASTICSEARCH_PASSWORD_FILE")"

exec "$@"