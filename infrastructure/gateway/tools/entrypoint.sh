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
        -subj "/C=TR/ST=Istanbul/L=Fatih/O=42Istanbul/CN=$DOMAIN_NAME" \
        -addext "basicConstraints=critical,CA:FALSE" \
        -addext "keyUsage=critical,digitalSignature,keyEncipherment" \
        -addext "extendedKeyUsage=serverAuth" \
        -addext "subjectAltName=DNS:${DOMAIN_NAME},DNS:${API_DOMAIN_NAME},DNS:${OPS_DOMAIN_NAME},DNS:${RUSTFS_DOMAIN_NAME}"

    echo "Gateway: SSL certificate is set up for:"
    echo "- $DOMAIN_NAME"
    echo "- $API_DOMAIN_NAME"
    echo "- $OPS_DOMAIN_NAME"
    echo "- $RUSTFS_DOMAIN_NAME"
fi

envsubst '${DOMAIN_NAME} ${API_DOMAIN_NAME} ${OPS_DOMAIN_NAME} ${RUSTFS_DOMAIN_NAME}' \
    < /etc/nginx/templates/nginx.conf.template \
    > /etc/nginx/nginx.conf

exec "$@"
