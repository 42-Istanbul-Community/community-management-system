#!/bin/sh

if [ -n "$DB_PASSWORD_FILE" ]; then
    DB_PASSWORD=$(cat $DB_PASSWORD_FILE)
else
    DB_PASSWORD=$DB_PASSWORD_FILE
fi


export DATABASE_URL="postgresql://${POSTGRES_USER}:${DB_PASSWORD}@postgres-id:5432/${POSTGRES_DB}?schema=public"

npm install
npx prisma generate

exec "$@"