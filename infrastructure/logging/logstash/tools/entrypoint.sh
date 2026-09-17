#!/bin/sh

set -e

export LOGSTASH_PASSWORD="$(cat "$LOGSTASH_PASSWORD_FILE")"

exec "$@"