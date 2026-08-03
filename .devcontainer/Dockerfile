FROM node:24.18.1-alpine3.24@sha256:9b6d6e32fdbed527c0492b8e2d9d4c9081644a080b772670816bec13ba50b683

USER root

# Update Alpine packages with latest security and bug fixes
RUN apk upgrade --no-cache

# Setup nodejs group & nodejs user
RUN addgroup --system nodejs --gid 998 && \
    adduser --system nodejs --uid 999 --home /app/ && \
    chown -R 999:998 /app/

USER 999

WORKDIR /app
