FROM node:24-alpine

WORKDIR /content

COPY ./migrations ./migrations
COPY ./srcs ./srcs

EXPOSE 8000

COPY ./tools/entrypoint.sh /usr/bin/entrypoint.sh
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["/usr/bin/entrypoint.sh"]

CMD ["node", "srcs/index.js"]