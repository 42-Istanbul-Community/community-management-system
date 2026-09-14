#!/bin/sh
set -e

export FT_CLIENT_ID="$(cat /run/secrets/42_client_id)"
export FT_CLIENT_SECRET="$(cat /run/secrets/42_client_secret)"
export GOOGLE_CLIENT_ID="$(cat /run/secrets/google_client_id)"
export GOOGLE_CLIENT_SECRET="$(cat /run/secrets/google_client_secret)"