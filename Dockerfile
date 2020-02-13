FROM php:alpine

LABEL maintainer="Lucas Cândido de Souza Silva <lcssbr@gmail.com>"

RUN apk update && \
  apk upgrade --available && \
  apk add --no-cache --virtual .build-deps postgresql-dev && \
  apk add --no-cache git composer php7-pdo_pgsql && \
  docker-php-ext-install pdo_pgsql && \
  apk del .build-deps && \
  composer selfupdate && \
  adduser -D -u 1000 myspace

USER myspace
