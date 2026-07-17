FROM nginx:1.28.3-alpine

RUN apk add --no-cache openssl

COPY conf/nginx.conf /etc/nginx/nginx.conf
COPY conf/ssl.conf /etc/nginx/ssl.conf
COPY conf/proxy.conf /etc/nginx/proxy.conf
COPY conf/html /usr/share/nginx/html
COPY tools/ssl_init.sh /usr/local/bin/ssl_init.sh

EXPOSE 80 443

RUN chmod +x /usr/local/bin/ssl_init.sh
ENTRYPOINT ["/usr/local/bin/ssl_init.sh"]

CMD ["nginx", "-g", "daemon off;"]
