FROM node:22.15.0-alpine@sha256:ad1aedbcc1b0575074a91ac146d6956476c1f9985994810e4ee02efd932a68fd AS builder

#  Set the working directory to /app inside the container
WORKDIR /app

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
FROM nginx:1.28-alpine@sha256:aed99734248e851764f1f2146835ecad42b5f994081fa6631cc5d79240891ec9 as production-stage
RUN mkdir /app
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
CMD ["nginx", "-g", "daemon off;"]

RUN apk add --no-cache curl

# Health check
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost:3000/
