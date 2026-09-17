#!/bin/sh

set -ex

ELASTIC_PASSWORD=$(cat "$ELASTICSEARCH_PASSWORD_FILE")
KIBANA_PASSWORD=$(cat "$KIBANA_PASSWORD_FILE")
LOGSTASH_PASSWORD=$(cat "$LOGSTASH_PASSWORD_FILE")

echo "Waiting for Elasticsearch..."

until curl -fsSu "$ELASTICSEARCH_USERNAME:$ELASTIC_PASSWORD" \
    "$ELASTICSEARCH_HOSTS/_cluster/health?wait_for_status=yellow&timeout=5s" \
    >/dev/null
do
    sleep 5
done

echo "Elasticsearch cluster is ready."

until curl -fsSu "$ELASTICSEARCH_USERNAME:$ELASTIC_PASSWORD" \
    "$ELASTICSEARCH_HOSTS/_security/_authenticate" \
    >/dev/null
do
    echo "Waiting for Elasticsearch security..."
    sleep 5
done

echo "Elasticsearch security is ready."

curl -fsSu "$ELASTICSEARCH_USERNAME:$ELASTIC_PASSWORD" \
    -H "Content-Type: application/json" \
    -X POST "$ELASTICSEARCH_HOSTS/_security/user/kibana_system/_password" \
    -d "{\"password\":\"$KIBANA_PASSWORD\"}"

curl -fsSu "$ELASTICSEARCH_USERNAME:$ELASTIC_PASSWORD" \
    -H "Content-Type: application/json" \
    -X PUT "$ELASTICSEARCH_HOSTS/_security/role/logstash_writer" \
    -d @/logstash_writer.json

curl -fsSu "$ELASTICSEARCH_USERNAME:$ELASTIC_PASSWORD" \
    -H "Content-Type: application/json" \
    -X POST "$ELASTICSEARCH_HOSTS/_security/user/logstash_writer" \
    -d "{\"password\":\"$LOGSTASH_PASSWORD\",\"roles\":[\"logstash_writer\"]}"

echo "Elasticsearch setup completed."