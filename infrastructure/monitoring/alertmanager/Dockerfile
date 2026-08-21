FROM prom/alertmanager:v0.28.1

EXPOSE 9093

COPY conf/alertmanager.yml /etc/alertmanager/alertmanager.yml

ENTRYPOINT ["/bin/alertmanager"]
CMD ["--config.file=/etc/alertmanager/alertmanager.yml", "--web.route-prefix=/alerts/", "--web.external-url=https://ops.localhost:3443/alerts/"]