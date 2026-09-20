FROM alpine:3.22

RUN apk add --no-cache \
    curl

COPY ./conf/dashboards/log_activity.ndjson /log_activity.ndjson
COPY ./tools/entrypoint.sh /usr/bin/entrypoint.sh

RUN chmod +x /usr/bin/entrypoint.sh

ENTRYPOINT ["/usr/bin/entrypoint.sh"]