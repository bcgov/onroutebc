# Taken largely from https://github.com/microsoft/mssql-docker/blob/master/linux/preview/examples/mssql-customize/Dockerfile
ARG TARGETPLATFORM=linux/amd64
FROM --platform=$TARGETPLATFORM mcr.microsoft.com/mssql/server:2025-latest

USER root

# make sure PATH is defined for tools used during build
ENV PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

# prerequisites for adding Microsoft repository
RUN apt-get update && \
    apt-get install -y curl apt-transport-https gnupg && \
    rm -rf /var/lib/apt/lists/*

# add the Microsoft GPG key and repository explicitly
RUN curl -sSL https://packages.microsoft.com/keys/microsoft.asc | apt-key add - \
    && curl -sSL https://packages.microsoft.com/config/ubuntu/24.04/mssql-server-2025.list \
    | tee /etc/apt/sources.list.d/mssql-server-2025.list

# install full text search package (fails if unavailable)
RUN apt-get update && \
    apt-get install -y mssql-server-fts

ENV ACCEPT_EULA=Y

# Create a config directory
RUN mkdir -p /usr/config
WORKDIR /usr/config

# Copy initialization scripts
COPY ./scripts/ /usr/config/
COPY ./entrypoint.sh /usr/config/
COPY ./configure-db.sh /usr/config/

# ensure any helper scripts are executable regardless of host OS
RUN chmod +x /usr/config/*.sh

# Copy unit tests
RUN mkdir -p /usr/config/test/
COPY ./test/ /usr/config/test/

EXPOSE ${MSSQL_PORT}
RUN mkdir -p -m 770 /var/opt/mssql && chown -R mssql: /var/opt/mssql

# Create tmp dir for scripts when reverting
RUN mkdir -p -m 700 /usr/config/tmp && chown -R mssql: /usr/config/tmp
USER mssql

ENTRYPOINT ["./entrypoint.sh"]

# Healthcheck
HEALTHCHECK --interval=15s --timeout=5s --retries=3 \
    CMD /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$$SA_PASSWORD" -Q "SELECT 1"
