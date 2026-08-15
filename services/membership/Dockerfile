FROM node:24-alpine

WORKDIR /membership

RUN apk add --no-cache postgresql-client

COPY ./migrations ./migrations
COPY ./srcs ./srcs

EXPOSE 3000

COPY ./tools/entrypoint.sh /usr/bin/entrypoint.sh
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["/usr/bin/entrypoint.sh"]

CMD ["node", "srcs/index.js"]
