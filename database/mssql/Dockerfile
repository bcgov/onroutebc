# Taken largely from https://github.com/microsoft/mssql-docker/blob/master/linux/preview/examples/mssql-customize/Dockerfile
ARG TARGETPLATFORM=linux/amd64
FROM --platform=$TARGETPLATFORM mcr.microsoft.com/mssql/server:2025-latest

USER root

# make sure PATH is defined for tools used during build
ENV PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

# prerequisites for adding Microsoft repository
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl apt-transport-https gnupg && \
    rm -rf /var/lib/apt/lists/*

# Setup Microsoft repository and install full-text search
RUN curl -sSL https://packages.microsoft.com/keys/microsoft.asc | apt-key add - && \
    curl -sSL https://packages.microsoft.com/config/ubuntu/24.04/mssql-server-2025.list | tee /etc/apt/sources.list.d/mssql-server-2025.list && \
    apt-get update && \
    apt-get install -y --no-install-recommends mssql-server-fts gosu && \
    rm -rf /var/lib/apt/lists/*

ENV ACCEPT_EULA=Y

# Create config directory and set permissions
RUN mkdir -p /usr/config /usr/config/test /usr/config/tmp /var/opt/mssql && \
    chown -R mssql:mssql /var/opt/mssql /usr/config/tmp && \
    chmod -R 755 /var/opt/mssql /usr/config/tmp

WORKDIR /usr/config

# Copy initialization scripts
COPY ./scripts/ /usr/config/
COPY ./entrypoint.sh /usr/config/
COPY ./configure-db.sh /usr/config/

# ensure any helper scripts are executable regardless of host OS
RUN find /usr/config -name "*.sh" -exec chmod +x {} \;

# Copy unit tests
COPY ./test/ /usr/config/test/

EXPOSE ${MSSQL_PORT}

ENTRYPOINT ["./entrypoint.sh"]

# Healthcheck
HEALTHCHECK --interval=15s --timeout=5s --retries=3 \
    CMD /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$$SA_PASSWORD" -Q "SELECT 1"
