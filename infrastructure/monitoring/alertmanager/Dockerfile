FROM prom/alertmanager:v0.28.1

USER root

COPY tools/entrypoint.sh /usr/local/bin/entrypoint.sh

RUN chmod +x /usr/local/bin/entrypoint.sh

USER nobody

EXPOSE 9093

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]