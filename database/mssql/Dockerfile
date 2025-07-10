# Taken largely from https://github.com/microsoft/mssql-docker/blob/master/linux/preview/examples/mssql-customize/Dockerfile
FROM mcr.microsoft.com/mssql/server:2017-latest

USER root

RUN apt-get update && \
    apt-get install -y software-properties-common  --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*
RUN add-apt-repository "$(wget -qO- https://packages.microsoft.com/config/ubuntu/18.04/mssql-server-2017.list)" && \
    apt-get install -y mssql-server-fts --no-install-recommends

ENV ACCEPT_EULA=Y

# Create a config directory
RUN mkdir -p /usr/config
WORKDIR /usr/config

# Copy initialization scripts
COPY ./scripts/ /usr/config/
COPY ./entrypoint.sh /usr/config/
COPY ./configure-db.sh /usr/config/

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
    CMD /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$$SA_PASSWORD" -Q "SELECT 1"
