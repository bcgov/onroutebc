FROM mcr.microsoft.com/mssql/server:2019-latest

ENV ACCEPT_EULA Y
ENV SA_PASSWORD "YourStrong@Passw0rd"
ENV DDL_FILENAME "onroutebc_ddl_v1.sql"

# Copy initialization scripts
COPY ./ddl/ .
COPY ./entrypoint.sh .

EXPOSE 1433

# Use this line to use onroutebc_ddl_v1.sql for DDL for local development
CMD /bin/bash ./entrypoint.sh