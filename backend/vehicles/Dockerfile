# Build container
FROM node:18.17.1-alpine AS builder

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
FROM node:18.17.1-alpine
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
ENV CHES_TOKEN_URL ${CHES_TOKEN_URL}
ENV CHES_CLIENT_ID ${CHES_CLIENT_ID}
ENV CHES_CLIENT_SECRET ${CHES_CLIENT_SECRET}
ENV CHES_URL ${CHES_URL}
ENV DOPS_URL ${DOPS_URL}
ENV FRONT_END_URL ${FRONT_END_URL}
ENV PAYBC_API_KEY ${PAYBC_API_KEY}
ENV PAYBC_REF_NUMBER ${PAYBC_REF_NUMBER}
ENV PAYBC_BASE_URL ${PAYBC_BASE_URL}
ENV GL_CODE ${GL_CODE}
ENV PAYBC_REDIRECT ${PAYBC_REDIRECT}

# Copy production files from build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Expose Port
EXPOSE 5000

# Start the app
CMD ["npm", "run", "start:prod"]

