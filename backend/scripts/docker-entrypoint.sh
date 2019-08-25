#!/bin/bash

set -ue

# Allow setting either DATABASE_URL (takes precedence) or POSTGRESQL_*
POSTGRESQL_USERNAME="${POSTGRESQL_USERNAME:-edegal}"
POSTGRESQL_PASSWORD="${POSTGRESQL_PASSWORD:-secret}"
POSTGRESQL_HOSTNAME="${POSTGRESQL_HOSTNAME:-postgres}"
POSTGRESQL_DATABASE="${POSTGRESQL_DATABASE:-edegal}"
export DATABASE_URL="${DATABASE_URL:-psql://$POSTGRESQL_USERNAME:$POSTGRESQL_PASSWORD@$POSTGRESQL_HOSTNAME/$POSTGRESQL_DATABASE}"

# Allow setting either BROKER_URL/CACHE_URL (takes precedence) or REDIS_HOSTNAME
export BROKER_URL="${BROKER_URL:-redis://$REDIS_HOSTNAME/$redis_broker_database}"
export CACHE_URL="${CACHE_URL:-rediscache://$REDIS_HOSTNAME/$REDIS_CACHE_DATABASE}"

exec "$@"
