FROM node:18.12.1-alpine as builder

# Set the working directory to /app inside the container
WORKDIR /app

# Set variables
#ARG NODE_ENV
#ENV NODE_ENV ${NODE_ENV}

ARG REACT_APP_DEPLOY_ENVIRONMENT
ENV REACT_APP_DEPLOY_ENVIRONMENT ${REACT_APP_DEPLOY_ENVIRONMENT}

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
EXPOSE 3000

# Start the app
#CMD [ "npx", "serve", "build" ]

FROM nginx
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html
