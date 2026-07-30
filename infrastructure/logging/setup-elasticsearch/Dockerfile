FROM alpine:3.22

RUN apk add --no-cache \
    bash \
    curl \
    jq

COPY ./conf/logstash_writer.json /logstash_writer.json
COPY ./tools/entrypoint.sh /usr/bin/entrypoint.sh

RUN chmod +x /usr/bin/entrypoint.sh

ENTRYPOINT ["/usr/bin/entrypoint.sh"]