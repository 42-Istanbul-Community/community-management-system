FROM docker.elastic.co/kibana/kibana:9.1.3

COPY ./conf/kibana.yml /usr/share/kibana/config/kibana.yml

EXPOSE 5601

COPY --chmod=755 ./tools/entrypoint.sh /usr/bin/entrypoint.sh
ENTRYPOINT ["/usr/bin/entrypoint.sh"]

CMD ["kibana-docker"]