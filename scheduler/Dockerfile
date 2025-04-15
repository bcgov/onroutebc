#  Build container
FROM node:22.14.0-alpine AS builder

#install ssh for sending file to GARMS mainframe
RUN apk update && apk add --no-cache openssh-client && apk add --no-cache sshpass && apk add --no-cache netcat-traditional

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
FROM node:22.14.0-alpine

#install ssh for sending file to GARMS mainframe
RUN apk update && apk add --no-cache openssh-client && apk add --no-cache sshpass && apk add --no-cache netcat-traditional

RUN npm cache clean --force

# Create and Assign permissions to npm folder
RUN mkdir /.npm && chmod 777 /.npm

# Set the working directory to /app inside the deployment container
WORKDIR /app

# Copy production files from build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

RUN apk add --no-cache curl

# Expose Port
EXPOSE 5050

# Non-root user
USER node

# Start the app
CMD ["npm", "run", "start:prod"]

# Health check
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost:5050/
