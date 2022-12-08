#!/bin/bash

# Run init-script with long timeout - and make it run in the background
/opt/mssql-tools/bin/sqlcmd -S localhost -l 60 -U SA
 \ -P "YourStrong@Passw0rd" -i onroutebc_ddl_v1.sql &
# Start SQL server
/opt/mssql/bin/sqlservr