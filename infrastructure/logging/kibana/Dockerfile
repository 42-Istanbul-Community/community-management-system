FROM docker.elastic.co/kibana/kibana:9.1.3

COPY ./conf/kibana.yml /usr/share/kibana/config/kibana.yml
COPY ./conf/dashboards/log_activity.ndjson /tmp/log_activity.ndjson

EXPOSE 5601

COPY --chmod=755 ./tools/entrypoint.sh /usr/bin/entrypoint.sh
ENTRYPOINT ["/usr/bin/entrypoint.sh"]