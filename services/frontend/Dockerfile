FROM node:24-alpine AS builder

WORKDIR /frontend

COPY ./srcs/package*.json ./
RUN npm ci

COPY ./srcs ./
RUN npm run build

COPY ./conf/.htaccess /frontend/dist/.htaccess

FROM httpd:2.4-alpine

COPY ./conf/httpd.conf /usr/local/apache2/conf/httpd.conf
COPY --from=builder /frontend/dist/ /usr/local/apache2/htdocs/

EXPOSE 80

CMD ["httpd-foreground"]