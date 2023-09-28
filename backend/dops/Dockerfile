# Build static files
# Node Bullseye has npm
FROM node:20.7.0-bullseye-slim AS build

# Install packages, build and keep only prod packages
WORKDIR /app
COPY *.json ./
COPY ./src ./src
RUN npm ci --ignore-scripts --no-update-notifier
RUN npm run build
RUN npm prune --production

# Deploy container
FROM node:20.7.0-bullseye-slim AS deploy
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

# Packages
RUN apt update && \
    apt install -y \
        ca-certificates \
        chromium \
        curl \
        fonts-freefont-ttf \
        libfreetype6 \
        libharfbuzz0b \
        libnss3

# Copy over app
WORKDIR /app
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# Ports, health check and non-root user
EXPOSE 5001
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost/:5001
USER node

# Start the app
CMD ["--max-old-space-size=500", "/app/dist/main"]
