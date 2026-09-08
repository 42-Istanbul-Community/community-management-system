FROM grafana/grafana:12.1.1

COPY ./conf/grafana.ini /etc/grafana/grafana.ini

COPY ./conf/provisioning /etc/grafana/provisioning
COPY ./conf/dashboards /etc/grafana/dashboards

EXPOSE 3000