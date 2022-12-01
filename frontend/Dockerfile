# RedHat UBI 8 with nodejs 14
#FROM registry.access.redhat.com/ubi8/ubi as builder
#RUN dnf module install -y nodejs:18

FROM node:18-alpine

# Set the working directory to /app inside the container
WORKDIR /app

# Install app dependencies
COPY ./package*.json ./

# Clear cache to avoid permission errors on the /.npm directory
#RUN npm cache clear --force

# Assign permissions to npm folder
RUN mkdir /.npm && chmod 777 /.npm

# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
RUN npm ci

# Copy app files
COPY . .

# Build
RUN npm run build

# Expose Port
EXPOSE 3000

# Start the app
CMD [ "npx", "serve", "build" ]