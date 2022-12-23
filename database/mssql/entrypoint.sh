#!/bin/bash

# Run init-script with long timeout - and make it run in the background
/opt/mssql-tools/bin/sqlcmd -S $MSSQL_HOST -l 60 -U $MSSQL_SA_USER -P $MSSQL_SA_PASSWORD -i $MSSQL_DDL_FILENAME &
# Start SQL server
/opt/mssql/bin/sqlservr