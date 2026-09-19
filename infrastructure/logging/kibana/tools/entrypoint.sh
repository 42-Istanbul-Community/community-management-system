#!/bin/sh

set -e

export KIBANA_PASSWORD="$(cat "$KIBANA_PASSWORD_FILE")"

until curl -s http://localhost:5601/api/status | grep -q "available"; do
  sleep 5
done

curl -X POST "http://localhost:5601/api/saved_objects/_import?overwrite=true" \
  -H "kbn-xsrf: true" \
  --form file=@/tmp/log_activity.ndjson

exec /usr/local/bin/kibana-docker