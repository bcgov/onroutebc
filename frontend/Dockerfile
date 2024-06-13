# Build static files
FROM node:20.12.0-alpine AS builder

# Install packages, build and keep only prod packages
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


# Deploy container
# Caddy serves static files
FROM caddy:2.8.4-alpine
RUN apk add --no-cache ca-certificates

# Copy static files and run formatting
COPY --from=builder /app/build /srv
COPY Caddyfile /etc/caddy/Caddyfile
RUN caddy fmt --overwrite /etc/caddy/Caddyfile

# Ports
EXPOSE 3000 3001

# Non-root user
USER node

# Health check
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost/:3001/health
