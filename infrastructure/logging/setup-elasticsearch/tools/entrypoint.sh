#!/bin/sh

set -ex

ELASTIC_PASSWORD=$(cat "$ELASTICSEARCH_PASSWORD_FILE")
KIBANA_PASSWORD=$(cat "$KIBANA_PASSWORD_FILE")
LOGSTASH_PASSWORD=$(cat "$LOGSTASH_PASSWORD_FILE")

until curl -su "$ELASTICSEARCH_USERNAME:$ELASTIC_PASSWORD" \
    "$ELASTICSEARCH_HOSTS/_security/_authenticate" >/dev/null 2>&1
do
    sleep 2
done

sleep 5

curl_retry() {
    n=0
    until [ "$n" -ge 30 ]; do
        curl -fs --connect-timeout 5 --max-time 10 "$@" && return 0
        n=$((n + 1))
        sleep 8
    done

    return 1
}

curl_retry -u "$ELASTICSEARCH_USERNAME:$ELASTIC_PASSWORD" \
    -H "Content-Type: application/json" \
    -X POST "$ELASTICSEARCH_HOSTS/_security/user/kibana_system/_password" \
    -d "{\"password\":\"$KIBANA_PASSWORD\"}"

curl_retry -u "$ELASTICSEARCH_USERNAME:$ELASTIC_PASSWORD" \
    -H "Content-Type: application/json" \
    -X POST "$ELASTICSEARCH_HOSTS/_security/role/logstash_writer" \
    -d @/logstash_writer.json

curl_retry -u "$ELASTICSEARCH_USERNAME:$ELASTIC_PASSWORD" \
    -H "Content-Type: application/json" \
    -X POST "$ELASTICSEARCH_HOSTS/_security/user/logstash_writer" \
    -d "{\"password\":\"$LOGSTASH_PASSWORD\",\"roles\":[\"logstash_writer\"]}"