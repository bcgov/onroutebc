FROM mcr.microsoft.com/mssql/server:2019-latest

ENV MSSQL_HOST ${MSSQL_HOST}
ENV MSSQL_PORT ${MSSQL_PORT}
ENV MSSQL_DB ${MSSQL_DB}
ENV MSSQL_SA_USER ${MSSQL_SA_USER}
ENV MSSQL_SA_PASSWORD ${MSSQL_SA_PASSWORD}
ENV MSSQL_ENCRYPT ${MSSQL_ENCRYPT}
ENV MSSQL_DDL_FILENAME ${MSSQL_DDL_FILENAME}

ENV ACCEPT_EULA Y


# Copy initialization scripts
COPY ./ddl/ .
COPY ./entrypoint.sh .

EXPOSE ${MSSQL_PORT}

# Use this line to use a DDL file during startup for local development
CMD /bin/bash ./entrypoint.sh