# Build static files
FROM node:18.7.0-slim AS build
WORKDIR /app
COPY . ./
RUN npm i && \
    npm run build && \
    npm prune --production

# https://github.com/astefanutti/decktape/blob/master/Dockerfile
FROM node:18-alpine3.15

ENV NODE_ENV production

ENV DB_TYPE ${DB_TYPE}
ENV POSTGRESQL_HOST ${POSTGRESQL_HOST}
ENV POSTGRESQL_USER ${POSTGRESQL_USER}
ENV POSTGRESQL_PASSWORD ${POSTGRESQL_PASSWORD}
ENV POSTGRESQL_DATABASE ${POSTGRESQL_DATABASE}
ENV MSSQL_HOST ${MSSQL_HOST}
ENV MSSQL_PORT ${MSSQL_PORT}
ENV MSSQL_DB ${MSSQL_DB}
ENV MSSQL_SA_USER ${MSSQL_SA_USER}
ENV MSSQL_SA_PASSWORD ${MSSQL_SA_PASSWORD}
ENV MSSQL_ENCRYPT ${MSSQL_ENCRYPT}
ENV AUTH0_ISSUER_URL ${AUTH0_ISSUER_URL}
ENV AUTH0_AUDIENCE ${AUTH0_AUDIENCE}
ENV AUTH0_IGNORE_EXP ${AUTH0_IGNORE_EXP}
ENV DOPS_CVSE_FORMS_CACHE_TTL_MS ${DOPS_CVSE_FORMS_CACHE_TTL_MS}
ENV DOPS_S3_ACCESS_TYPE ${DOPS_S3_ACCESS_TYPE}
ENV DOPS_S3_ACCESSKEYID ${DOPS_S3_ACCESSKEYID}
ENV DOPS_S3_BUCKET ${DOPS_S3_BUCKET}
ENV DOPS_S3_PRESIGNED_URL_EXPIRY ${DOPS_S3_PRESIGNED_URL_EXPIRY}
ENV DOPS_S3_ENDPOINT ${DOPS_S3_ENDPOINT}
ENV DOPS_S3_KEY ${DOPS_S3_KEY}
ENV DOPS_S3_SECRETACCESSKEY ${DOPS_S3_SECRETACCESSKEY}
ENV CDOGS_TOKEN_URL ${CDOGS_TOKEN_URL}
ENV CDOGS_CLIENT_ID ${CDOGS_CLIENT_ID}
ENV CDOGS_CLIENT_SECRET ${CDOGS_CLIENT_SECRET}
ENV CDOGS_URL ${CDOGS_URL}
ENV ACCESS_API_URL ${ACCESS_API_URL}
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# ARG CHROMIUM_VERSION=115.0.5790.170-r0
ENV TERM xterm-color

RUN <<EOF cat > /etc/apk/repositories
http://dl-cdn.alpinelinux.org/alpine/edge/main
http://dl-cdn.alpinelinux.org/alpine/edge/community
http://dl-cdn.alpinelinux.org/alpine/edge/testing
EOF

# Chromium, CA certificates, fonts
# https://git.alpinelinux.org/cgit/aports/log/community/chromium
    # chromium=${CHROMIUM_VERSION} \
RUN apk update && apk upgrade && \
    apk add --no-cache \
    ca-certificates \
    libstdc++ \
    font-noto-emoji \
    freetype \
    harfbuzz \
    nss \
    ttf-freefont \
    wqy-zenhei && \
    # /etc/fonts/conf.d/44-wqy-zenhei.conf overrides 'monospace' matching FreeMono.ttf in /etc/fonts/conf.d/69-unifont.conf
    mv /etc/fonts/conf.d/44-wqy-zenhei.conf /etc/fonts/conf.d/74-wqy-zenhei.conf && \
    rm -rf /var/cache/apk/*

WORKDIR /app
COPY --from=build --chown=app /app/node_modules ./node_modules
COPY --from=build --chown=app /app/dist ./dist

USER node

ENTRYPOINT ["node", "dist/main", "--chrome-arg=--no-sandbox"]
