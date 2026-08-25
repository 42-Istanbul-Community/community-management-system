#!/bin/sh
set -e

export SLACK_WEBHOOK_URL="$(cat /run/secrets/slack_webhook_url)"

cat > /tmp/alertmanager.yml <<EOF
global:
  resolve_timeout: 5m

route:
  receiver: "slack"
  group_by:
    - alertname
    - severity
  group_wait: 10s
  group_interval: 5m
  repeat_interval: 4h

receivers:
  - name: slack
    slack_configs:
      - api_url: "${SLACK_WEBHOOK_URL}"
        title: "{{ .CommonAnnotations.summary }}"
        text: "{{ .CommonAnnotations.description }}"
EOF

exec /bin/alertmanager \
  --config.file=/tmp/alertmanager.yml \
  --web.route-prefix=/alerts/ \
  --web.external-url="https://${OPS_DOMAIN_NAME}:8443/alerts/"