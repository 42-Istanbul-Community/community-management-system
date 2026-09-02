FROM node:22-alpine

WORKDIR /community

RUN apk add --no-cache postgresql-client

COPY ./migrations ./migrations
COPY ./seed ./seed
COPY ./srcs ./srcs

EXPOSE 80

COPY ./tools/entrypoint.sh /usr/bin/entrypoint.sh
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["/usr/bin/entrypoint.sh"]

CMD ["node", "srcs/index.js"]
