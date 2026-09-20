#!/bin/sh

set -e

export KIBANA_PASSWORD="$(cat "$KIBANA_PASSWORD_FILE")"

exec /usr/local/bin/kibana-docker "$@"