FROM prom/alertmanager:v0.28.1

EXPOSE 9093

COPY conf/alertmanager.yml /etc/alertmanager/alertmanager.yml

ENTRYPOINT ["/bin/alertmanager"]
CMD ["--config.file=/etc/alertmanager/alertmanager.yml"]