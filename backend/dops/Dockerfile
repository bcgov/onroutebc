# Build container
FROM node:18.17.0-alpine AS builder

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
FROM node:18.17.0-alpine
RUN npm cache clean --force

# Create and Assign permissions to npm folder
RUN mkdir /.npm && chmod 777 /.npm

# Set the working directory to /app inside the deployment container
WORKDIR /app

# Set node to production
ENV NODE_ENV production

# Set environment variables
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

# Copy production files from build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Expose Port
EXPOSE 5001

# Start the app
CMD ["npm", "run", "start:prod"]

