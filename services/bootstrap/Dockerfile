FROM node:22-alpine

WORKDIR /bootstrap

COPY ./srcs ./srcs

WORKDIR /bootstrap/srcs

RUN npm install

WORKDIR /bootstrap

CMD ["node", "srcs/index.js"]