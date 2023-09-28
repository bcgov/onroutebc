# FROM node:18-slim

# ENV DB_TYPE ${DB_TYPE}
# ENV POSTGRESQL_HOST ${POSTGRESQL_HOST}
# ENV POSTGRESQL_USER ${POSTGRESQL_USER}
# ENV POSTGRESQL_PASSWORD ${POSTGRESQL_PASSWORD}
# ENV POSTGRESQL_DATABASE ${POSTGRESQL_DATABASE}
# ENV MSSQL_HOST ${MSSQL_HOST}
# ENV MSSQL_PORT ${MSSQL_PORT}
# ENV MSSQL_DB ${MSSQL_DB}
# ENV MSSQL_SA_USER ${MSSQL_SA_USER}
# ENV MSSQL_SA_PASSWORD ${MSSQL_SA_PASSWORD}
# ENV MSSQL_ENCRYPT ${MSSQL_ENCRYPT}
# ENV AUTH0_ISSUER_URL ${AUTH0_ISSUER_URL}
# ENV AUTH0_AUDIENCE ${AUTH0_AUDIENCE}
# ENV AUTH0_IGNORE_EXP ${AUTH0_IGNORE_EXP}
# ENV DOPS_CVSE_FORMS_CACHE_TTL_MS ${DOPS_CVSE_FORMS_CACHE_TTL_MS}
# ENV DOPS_S3_ACCESS_TYPE ${DOPS_S3_ACCESS_TYPE}
# ENV DOPS_S3_ACCESSKEYID ${DOPS_S3_ACCESSKEYID}
# ENV DOPS_S3_BUCKET ${DOPS_S3_BUCKET}
# ENV DOPS_S3_PRESIGNED_URL_EXPIRY ${DOPS_S3_PRESIGNED_URL_EXPIRY}
# ENV DOPS_S3_ENDPOINT ${DOPS_S3_ENDPOINT}
# ENV DOPS_S3_KEY ${DOPS_S3_KEY}
# ENV DOPS_S3_SECRETACCESSKEY ${DOPS_S3_SECRETACCESSKEY}
# ENV CDOGS_TOKEN_URL ${CDOGS_TOKEN_URL}
# ENV CDOGS_CLIENT_ID ${CDOGS_CLIENT_ID}
# ENV CDOGS_CLIENT_SECRET ${CDOGS_CLIENT_SECRET}
# ENV CDOGS_URL ${CDOGS_URL}
# ENV ACCESS_API_URL ${ACCESS_API_URL}
# ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
# ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# # Install latest chrome dev package and fonts to support major charsets (Chinese, Japanese, Arabic, Hebrew, Thai and a few others)
# # Note: this installs the necessary libs to make the bundled version of Chromium that Puppeteer
# # installs, work.
# RUN apt-get update \
#     && apt-get install -y wget gnupg \
#     && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
#     && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
#     && apt-get update \
#     && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
#       --no-install-recommends \
#     && rm -rf /var/lib/apt/lists/*

# # Packages
# RUN apt update && \
#     apt install -y \
#         ca-certificates \
#         chromium \
#         curl \
#         fonts-freefont-ttf \
#         libfreetype6 \
#         libharfbuzz0b \
#         libnss3

# # If running Docker >= 1.13.0 use docker run's --init arg to reap zombie processes, otherwise
# # uncomment the following lines to have `dumb-init` as PID 1
# # ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.2/dumb-init_1.2.2_x86_64 /usr/local/bin/dumb-init
# # RUN chmod +x /usr/local/bin/dumb-init
# # ENTRYPOINT ["dumb-init", "--"]

# # Install packages, build and keep only prod packages
# WORKDIR /
# COPY . ./
# RUN npm i
# RUN npm run build
# RUN npm prune --production

# # Uncomment to skip the chromium download when installing puppeteer. If you do,
# # you'll need to launch puppeteer with:
# #     browser.launch({executablePath: 'google-chrome-stable'})
# # ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# # Install puppeteer so it's available in the container.
# RUN npm init -y &&  \
#     npm i puppeteer \
#     # Add user so we don't need --no-sandbox.
#     # same layer as npm install to keep re-chowned files from using up several hundred MBs more space
#     && groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
#     && mkdir -p "/.config/chromium/Crash Reports/pending/" \
#     && chown -R pptruser:pptruser "/.config/chromium/Crash Reports/pending/" \
#     && chown -R pptruser:pptruser /home/pptruser \
#     && chown -R pptruser:pptruser /node_modules \
#     && chown -R pptruser:pptruser /package.json \
#     && chown -R pptruser:pptruser /package-lock.json

# # Ports, health check and non-root user
# EXPOSE 5001
# HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost/:5001
# USER pptruser

# # Start the app
# CMD ["--max-old-space-size=500", "/dist/main"]


FROM ubuntu:latest as builder

RUN apt-get update
ENV NODE_VERSION=16.14.0
RUN apt install -y curl
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
RUN chmod -R 777 /root/.nvm/versions/node/v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"

# Install packages, build and keep only prod packages
WORKDIR /app
COPY . ./
RUN apt-get update -y
RUN apt-get install -y gconf-service libasound2 libatk1.0-0 libc6 \
    libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 \
    libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 \
    libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 \
    libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 \
    libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates \
    fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils \
    wget libgbm-dev gnupg gnupg2 gnupg1

# Install Chrome version 114
ENV CHROME_VERSION="114.0.5735.133-1"
RUN wget --no-verbose -O /tmp/chrome.deb https://dl.google.com/linux/chrome/deb/pool/main/g/google-chrome-stable/google-chrome-stable_${CHROME_VERSION}_amd64.deb \
  && apt install -y /tmp/chrome.deb \
  && rm /tmp/chrome.deb

# Set up directories and adjust permissions
RUN mkdir -p /root/.local/share/fonts \
  && mkdir -p /root/.config/puppeteer \
  && chmod -R 777 /root/.local \
  && chmod -R 777 /root/.config \
  && mkdir -p /.local \
  && chmod -R 777 /.local

RUN npm config set user 0
RUN npm config set unsafe-perm true
COPY . ./
RUN npm i
RUN npm run build
RUN npm prune --production

# Set node to production 
ENV NODE_ENV production

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
ENV AUTH0_ISSUER_URL ${AUTH0_ISSUER_URL}
ENV AUTH0_AUDIENCE ${AUTH0_AUDIENCE}
ENV AUTH0_IGNORE_EXP ${AUTH0_IGNORE_EXP}
ENV DOPS_CVSE_FORMS_CACHE_TTL_MS ${DOPS_CVSE_FORMS_CACHE_TTL_MS}
ENV DOPS_S3_ACCESS_TYPE ${DOPS_S3_ACCESS_TYPE}
ENV DOPS_S3_ACCESSKEYID ${DOPS_S3_ACCESSKEYID}
ENV DOPS_S3_BUCKET ${DOPS_S3_BUCKET}
ENV DOPS_S3_PRESIGNED_URL_EXPIRY ${DOPS_S3_PRESIGNED_URL_EXPIRY}
ENV DOPS_S3_ENDPOINT ${DOPS_S3_ENDPOINT}
ENV DOPS_S3_KEY ${DOPS_S3_KEY}
ENV DOPS_S3_SECRETACCESSKEY ${DOPS_S3_SECRETACCESSKEY}
ENV CDOGS_TOKEN_URL ${CDOGS_TOKEN_URL}
ENV CDOGS_CLIENT_ID ${CDOGS_CLIENT_ID}
ENV CDOGS_CLIENT_SECRET ${CDOGS_CLIENT_SECRET}
ENV CDOGS_URL ${CDOGS_URL}
ENV ACCESS_API_URL ${ACCESS_API_URL}
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Packages
RUN apt-get update && \
    apt-get install -y \
        ca-certificates \
        curl \
        fonts-freefont-ttf \
        libfreetype6 \
        libharfbuzz0b \
        libnss3

# Expose port - mostly a convention, for readability
EXPOSE 3000

# Start up command
ENTRYPOINT  ["node", "dist/main"]
