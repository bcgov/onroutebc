FROM node:18.16.0-alpine as builder

# Set the working directory to /app inside the container
WORKDIR /app

# Set variables
#ENV NODE_ENV production
ARG VITE_DEPLOY_ENVIRONMENT
ARG VITE_API_VEHICLE_URL
ARG VITE_AUTH0_ISSUER_URL
ARG VITE_AUTH0_AUDIENCE

ENV VITE_DEPLOY_ENVIRONMENT $VITE_DEPLOY_ENVIRONMENT
ENV VITE_API_VEHICLE_URL $VITE_API_VEHICLE_URL
ENV VITE_AUTH0_ISSUER_URL $VITE_AUTH0_ISSUER_URL
ENV VITE_AUTH0_AUDIENCE $VITE_AUTH0_AUDIENCE

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

# Non-privileged user
USER app

# Expose Port
EXPOSE 3000

# Have only the compiled app, ready for production with Nginx
FROM nginx:1.25.0-alpine as production-stage
RUN mkdir /app
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
CMD ["nginx", "-g", "daemon off;"]
