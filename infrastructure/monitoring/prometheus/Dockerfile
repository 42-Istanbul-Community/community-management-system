FROM prom/prometheus:v3.13.0

COPY ./conf/prometheus.yml /etc/prometheus/prometheus.yml
COPY ./conf/rules/*.yml /etc/prometheus/rules/

EXPOSE 9090