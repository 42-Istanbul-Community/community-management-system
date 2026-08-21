FROM node:24-alpine AS builder

WORKDIR /frontend

COPY ./srcs/package*.json ./
RUN npm ci

COPY ./srcs ./
RUN npm run build

FROM httpd:2.4-alpine

COPY --from=builder /frontend/dist/ /usr/local/apache2/htdocs/

EXPOSE 80

CMD ["httpd-foreground"]