FROM node:18.12.1-alpine

# Set the working directory to /app inside the container
WORKDIR /app

# Set node to production 
ARG NODE_ENV
ENV NODE_ENV production

# Set variables
ARG POSTGRESQL_HOST
ARG POSTGRESQL_USER
ARG POSTGRESQL_PASSWORD
ARG POSTGRESQL_DATABASE

ENV POSTGRESQL_HOST ${POSTGRESQL_HOST}
ENV POSTGRESQL_USER ${POSTGRESQL_USER}
ENV POSTGRESQL_PASSWORD ${POSTGRESQL_PASSWORD}
ENV POSTGRESQL_DATABASE ${POSTGRESQL_DATABASE}

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

