FROM mcr.microsoft.com/mssql/server:2019-latest

ENV ACCEPT_EULA Y
ENV SA_PASSWORD "YourStrong@Passw0rd"
ENV DDL_FILENAME "sample_ddl.sql"

# Copy initialization scripts
COPY ./ddl/ .
COPY ./entrypoint.sh .

EXPOSE 1433

# Use this line to use a DDL file during startup for local development
CMD /bin/bash ./entrypoint.sh