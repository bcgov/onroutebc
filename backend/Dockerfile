FROM node:18.12.1-alpine

# Set the working directory to /app inside the container
WORKDIR /app

# Set variables

# Set node to production 
ARG NODE_ENV
ENV NODE_ENV production

# mssql or postgres
ARG DB_TYPE
ARG POSTGRESQL_HOST
ARG POSTGRESQL_USER
ARG POSTGRESQL_PASSWORD
ARG POSTGRESQL_DATABASE
ARG MSSQL_HOST
ARG MSSQL_PORT
ARG MSSQL_DB
ARG MSSQL_SA_USER
ARG MSSQL_SA_PASSWORD
ARG MSSQL_ENCRYPT

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

# Install app dependencies
COPY ./package*.json ./

# Assign permissions to npm folder
RUN mkdir /.npm && chmod 777 /.npm

# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
RUN npm ci

# Copy app files
COPY . .

# Build
RUN npm run build

# Expose Port
EXPOSE 5000

# Start the app
CMD ["npm", "run", "start:prod"]

