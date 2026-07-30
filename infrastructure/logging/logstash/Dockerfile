FROM docker.elastic.co/logstash/logstash:9.1.3

COPY conf/logstash.yml /usr/share/logstash/config/logstash.yml
COPY conf/pipeline /usr/share/logstash/pipeline/

EXPOSE 9600

COPY --chmod=755 ./tools/entrypoint.sh /usr/bin/entrypoint.sh
ENTRYPOINT ["/usr/bin/entrypoint.sh"]

CMD ["logstash"]