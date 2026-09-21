FROM nginx:1.28.3-alpine

RUN apk add --no-cache \
    openssl \
    gettext

COPY conf/nginx.conf.template /etc/nginx/templates/nginx.conf.template

COPY conf/ssl.conf /etc/nginx/ssl.conf
COPY conf/proxy.conf /etc/nginx/proxy.conf
COPY conf/auth.conf /etc/nginx/auth.conf
COPY conf/super_admin_auth.conf /etc/nginx/super_admin_auth.conf
COPY conf/html /usr/share/nginx/html

COPY tools/entrypoint.sh /usr/local/bin/entrypoint.sh

EXPOSE 80 443

RUN chmod +x /usr/local/bin/entrypoint.sh
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

CMD ["nginx", "-g", "daemon off;"]
