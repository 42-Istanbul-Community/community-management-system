#!/bin/sh

set -e

ELASTIC_PASSWORD=$(cat "$ELASTICSEARCH_PASSWORD_FILE")
KIBANA_PASSWORD=$(cat "$KIBANA_PASSWORD_FILE")
LOGSTASH_PASSWORD=$(cat "$LOGSTASH_PASSWORD_FILE")

until curl -su "$ELASTICSEARCH_USERNAME:$ELASTIC_PASSWORD" \
    "$ELASTICSEARCH_HOSTS/_security/_authenticate" >/dev/null 2>&1
do
    sleep 2
done

curl -fs -u "$ELASTICSEARCH_USERNAME:$ELASTIC_PASSWORD" \
    -H "Content-Type: application/json" \
    -X POST "$ELASTICSEARCH_HOSTS/_security/user/kibana_system/_password" \
    -d "{\"password\":\"$KIBANA_PASSWORD\"}"

curl -fs -u "$ELASTICSEARCH_USERNAME:$ELASTIC_PASSWORD" \
    -H "Content-Type: application/json" \
    -X POST "$ELASTICSEARCH_HOSTS/_security/role/logstash_writer" \
    -d @/logstash_writer.json

curl -fs -u "$ELASTICSEARCH_USERNAME:$ELASTIC_PASSWORD" \
    -H "Content-Type: application/json" \
    -X POST "$ELASTICSEARCH_HOSTS/_security/user/logstash_writer" \
    -d "{\"password\":\"$LOGSTASH_PASSWORD\",\"roles\":[\"logstash_writer\"]}"