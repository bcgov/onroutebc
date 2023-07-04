# Taken largely from https://github.com/microsoft/mssql-docker/blob/master/linux/preview/examples/mssql-customize/Dockerfile
FROM mcr.microsoft.com/mssql/server:2017-latest

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

ENTRYPOINT ["./entrypoint.sh"]