FROM node:18.12.1-alpine as builder

# Set the working directory to /app inside the container
WORKDIR /app

# Set variables
#ARG NODE_ENV
#ENV NODE_ENV ${NODE_ENV}

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

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx as production-stage
RUN mkdir /app
RUN mkdir /usr/share/nginx/html/config
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
CMD ["nginx", "-g", "daemon off;"]
