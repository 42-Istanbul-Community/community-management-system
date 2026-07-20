FROM docker.elastic.co/logstash/logstash:9.1.3

COPY conf/logstash.yml /usr/share/logstash/config/logstash.yml
COPY conf/pipeline /usr/share/logstash/pipeline/

EXPOSE 9600