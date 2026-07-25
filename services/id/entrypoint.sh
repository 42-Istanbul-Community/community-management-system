#!/bin/sh

if [ -n "$POSTGRES_PASSWORD_FILE" ]; then
    DB_PASSWORD=$(cat $POSTGRES_PASSWORD_FILE)
else
    DB_PASSWORD=$POSTGRES_PASSWORD
fi


export DATABASE_URL="postgresql://${POSTGRES_USER}:${DB_PASSWORD}@postgres-id:5432/${POSTGRES_DB}?schema=public"

npm install
npx prisma migrate deploy

exec "$@"