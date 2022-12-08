FROM mcr.microsoft.com/mssql/server:2019-latest
COPY ./entrypoint.sh .
COPY ./onroutebc_ddl_v1.sql .
ENV ACCEPT_EULA Y
ENV SA_PASSWORD "YourStrong@Passw0rd"
CMD /bin/bash ./entrypoint.sh