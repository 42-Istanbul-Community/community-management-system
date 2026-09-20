#!/bin/sh

set -e

ELASTICSEARCH_PASSWORD="$(cat "$ELASTICSEARCH_PASSWORD_FILE")"

echo "Waiting for Kibana..."

until curl --silent --show-error --fail \
    --user "elastic:${ELASTICSEARCH_PASSWORD}" \
    "http://kibana:5601/logs/api/status" \
    | grep -q '"level":"available"'
do
    sleep 5
done

echo "Kibana is ready."

curl --fail --silent --show-error \
    --user "elastic:${ELASTICSEARCH_PASSWORD}" \
    -X POST \
    "http://kibana:5601/logs/api/saved_objects/_import?overwrite=true" \
    -H "kbn-xsrf: true" \
    -F "file=@/log_activity.ndjson;type=application/x-ndjson"

echo "Saved objects imported."