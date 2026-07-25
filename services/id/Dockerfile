FROM node:24-alpine

WORKDIR /id

COPY ./srcs ./srcs

COPY ./entrypoint.sh ./entrypoint.sh

ENTRYPOINT ["bash", "/entrypoint.sh"]

CMD ["node", "srcs/index.js"]
