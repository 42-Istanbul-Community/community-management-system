#!/bin/sh

set -e

export MINIO_COMMUNITY_ACCESS_KEY="$(cat /run/secrets/minio_community_access_key)"
export MINIO_COMMUNITY_SECRET_KEY="$(cat /run/secrets/minio_community_secret_key)"

if [ -n "$DB_PASSWORD_FILE" ]; then
    DB_PASSWORD=$(cat "$DB_PASSWORD_FILE")
fi

export DATABASE_URL="postgresql://${POSTGRES_USER}:${DB_PASSWORD}@postgres-id:5432/${POSTGRES_DB}?schema=public"

export PSQL_URL="postgresql://${POSTGRES_USER}:${DB_PASSWORD}@postgres-community:5432/${POSTGRES_DB}"

psql "$PSQL_URL" -v ON_ERROR_STOP=1 -q -c "CREATE TABLE IF NOT EXISTS schema_migrations (
    version TEXT PRIMARY KEY,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
);"

for file in ./migrations/*.sql; do
    [ -f "$file" ] || break
    version=$(basename "$file")
    already_applied=$(psql "$PSQL_URL" -tA -c "SELECT 1 FROM schema_migrations WHERE version = '${version}';")

    if [ "$already_applied" = "1" ]; then
        continue
    fi
    psql "$PSQL_URL" -v ON_ERROR_STOP=1 -q -f "$file"
    psql "$PSQL_URL" -q -c "INSERT INTO schema_migrations (version) VALUES ('${version}');"
done

cd ./srcs
npm install
npx prisma generate
cd ..

exec "$@"