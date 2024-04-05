#  Build container
FROM node:20.12.1-alpine AS builder

# Set the working directory to /app inside the container
WORKDIR /app

# Copy app files
COPY . ./

# Create and Assign permissions to npm folder
RUN mkdir /.npm && chmod 777 /.npm

# Install packages, build and keep only prod packages
RUN npm ci
RUN npm run build
RUN npm prune --production



# Deployment container
FROM node:20.12.1-alpine
RUN npm cache clean --force

# Create and Assign permissions to npm folder
RUN mkdir /.npm && chmod 777 /.npm

# Set the working directory to /app inside the deployment container
WORKDIR /app

# Set node to production
ENV NODE_ENV ${NODE_ENV}

# Set environment variables
ENV DB_TYPE ${DB_TYPE}
ENV TPS_API_LOG_LEVEL ${TPS_API_LOG_LEVEL}
ENV TPS_API_TYPEORM_LOG_LEVEL ${TPS_API_TYPEORM_LOG_LEVEL}
ENV TPS_API_MAX_QUERY_EXECUTION_TIME_MS ${TPS_API_MAX_QUERY_EXECUTION_TIME_MS}
ENV MSSQL_HOST ${MSSQL_HOST}
ENV MSSQL_PORT ${MSSQL_PORT}
ENV MSSQL_DB ${MSSQL_DB}
ENV MSSQL_SA_USER ${MSSQL_SA_USER}
ENV MSSQL_SA_PASSWORD ${MSSQL_SA_PASSWORD}
ENV MSSQL_ENCRYPT ${MSSQL_ENCRYPT}
ENV KEYCLOAK_ISSUER_URL ${KEYCLOAK_ISSUER_URL}
ENV KEYCLOAK_AUDIENCE ${KEYCLOAK_AUDIENCE}
ENV KEYCLOAK_IGNORE_EXP ${KEYCLOAK_IGNORE_EXP}
ENV OCIO_S3_ACCESSKEYID ${OCIO_S3_ACCESSKEYID}
ENV OCIO_S3_BUCKET ${OCIO_S3_BUCKET}
ENV OCIO_S3_PRESIGNED_URL_EXPIRY ${OCIO_S3_PRESIGNED_URL_EXPIRY}
ENV OCIO_S3_ENDPOINT ${OCIO_S3_ENDPOINT}
ENV OCIO_S3_KEY ${OCIO_S3_KEY}
ENV OCIO_S3_SECRETACCESSKEY ${OCIO_S3_SECRETACCESSKEY}
ENV TPS_POLL_LIMIT ${TPS_POLL_LIMIT}
ENV TPS_PENDING_POLLING_INTERVAL ${TPS_PENDING_POLLING_INTERVAL}
ENV TPS_ERROR_POLLING_INTERVAL ${TPS_ERROR_POLLING_INTERVAL}

# Copy production files from build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Expose Port
EXPOSE 5050

# Non-root user
USER node

# Start the app
CMD ["npm", "run", "start:prod"]

# Health check
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost/:5050
