# Taken largely from https://github.com/microsoft/mssql-docker/blob/master/linux/preview/examples/mssql-customize/Dockerfile
FROM mcr.microsoft.com/mssql/server:2019-latest

USER root

RUN apt-get update && \
    apt-get install -y software-properties-common && \
    rm -rf /var/lib/apt/lists/*
RUN add-apt-repository "$(wget -qO- https://packages.microsoft.com/config/ubuntu/18.04/mssql-server-2019.list)" && \
    apt-get install -y mssql-server-fts && \
    apt-get install -y mssql-server-polybase

ENV ACCEPT_EULA Y

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
USER mssql

ENTRYPOINT ["./entrypoint.sh"]