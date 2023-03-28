FROM node:18.12.1-alpine as builder

# Set the working directory to /app inside the container
WORKDIR /app

# Set variables
#ENV NODE_ENV production

# Install app dependencies
COPY ./package*.json ./

# Assign permissions to npm folder
RUN mkdir /.npm && chmod 777 /.npm

RUN npm install -D semantic-release
RUN npm install -D semantic-release-monorepo
RUN npx semantic-release -e semantic-release-monorepo -r https://github.com/bcgov/onroutebc.git --branches main
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
FROM nginx:1.23.3-alpine as production-stage
RUN mkdir /app
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
CMD ["nginx", "-g", "daemon off;"]
