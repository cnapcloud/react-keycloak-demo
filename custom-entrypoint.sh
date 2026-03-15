#!/bin/sh
# Generate env-config.js from template at runtime
envsubst < /usr/share/nginx/html/env-config.js.template > /usr/share/nginx/html/env-config.js

# Hand off to nginx official entrypoint (handles /etc/nginx/templates/)
exec /docker-entrypoint.sh "$@"
