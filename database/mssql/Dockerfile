# Taken largely from https://github.com/microsoft/mssql-docker/blob/master/linux/preview/examples/mssql-customize/Dockerfile
FROM mcr.microsoft.com/mssql/server:2019-latest

ENV ACCEPT_EULA Y

# Create a config directory
RUN mkdir -p /usr/config
WORKDIR /usr/config

# Copy initialization scripts
COPY ./scripts/ /usr/config/
COPY ./entrypoint.sh /usr/config/
COPY ./configure-db.sh /usr/config/

# Grant permissions for to our scripts to be executable
#RUN chmod +x /usr/config/entrypoint.sh
#RUN chmod +x /usr/config/configure-db.sh

EXPOSE ${MSSQL_PORT}

ENTRYPOINT ["./entrypoint.sh"]