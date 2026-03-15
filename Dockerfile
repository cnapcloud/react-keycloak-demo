# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY package.json ./
RUN pnpm install

COPY . .
RUN pnpm build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# nginx config template: BACKEND_URL is injected at runtime via envsubst
# nginx:alpine automatically processes files in /etc/nginx/templates/ at startup
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Copy env-config.js template (Keycloak runtime config)
COPY env-config.js.template /usr/share/nginx/html/env-config.js.template

# Default env vars (override in K8s with env)
ENV KEYCLOAK_REALM=cnap \
    KEYCLOAK_AUTH_SERVER_URL=http://localhost:8080 \
    KEYCLOAK_CLIENT_ID=react \
    NGINX_ACCESS_LOG=off

COPY custom-entrypoint.sh /custom-entrypoint.sh
RUN chmod +x /custom-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/custom-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
