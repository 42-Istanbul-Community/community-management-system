#!/bin/sh
set -e

SSL_DIR="/etc/nginx/ssl"
KEY_FILE="${SSL_DIR}/nginx.key"
CERT_FILE="${SSL_DIR}/nginx.crt"

if [ ! -f "$CERT_FILE" ] || [ ! -f "$KEY_FILE" ]; then
    echo "Gateway: SSL certificate will be set up..."

    mkdir -p "$SSL_DIR"

    openssl req -x509 -nodes \
        -days 365 \
        -newkey rsa:2048 \
        -keyout "$KEY_FILE" \
        -out "$CERT_FILE" \
        -subj "/C=TR/ST=Istanbul/L=Sariyer/CN=$DOMAIN_NAME"

    echo "Gateway: SSL certificate is set up."
fi

exec "$@"
