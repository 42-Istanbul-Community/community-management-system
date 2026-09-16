FROM docker.elastic.co/beats/filebeat:8.10.0

USER root

COPY conf/filebeat.yml /usr/share/filebeat/filebeat.yml
RUN chmod 644 /usr/share/filebeat/filebeat.yml