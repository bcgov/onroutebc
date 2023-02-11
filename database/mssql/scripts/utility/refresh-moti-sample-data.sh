#!/bin/bash

# This script relies on the following environment variables:
#  MSSQL_MOTI_HOST
#  MSSQL_MOTI_DB
#  MSSQL_MOTI_USER
#  MSSQL_MOTI_PASSWORD
# These are all supplied to the docker container from your .env 'secrets' file
# in the project root. See docker-compose.yml for more details.

echo "Deleting existing data from moti db"
/opt/mssql-tools/bin/sqlcmd -U $MSSQL_MOTI_USER -P $MSSQL_MOTI_PASSWORD -S $MSSQL_MOTI_HOST -d $MSSQL_MOTI_DB -Q "DELETE FROM dbo.ORBC_TRAILER"
/opt/mssql-tools/bin/sqlcmd -U $MSSQL_MOTI_USER -P $MSSQL_MOTI_PASSWORD -S $MSSQL_MOTI_HOST -d $MSSQL_MOTI_DB -Q "DELETE FROM dbo.ORBC_POWER_UNIT"
/opt/mssql-tools/bin/sqlcmd -U $MSSQL_MOTI_USER -P $MSSQL_MOTI_PASSWORD -S $MSSQL_MOTI_HOST -d $MSSQL_MOTI_DB -Q "DELETE FROM dbo.ORBC_COMPANY_USER"
/opt/mssql-tools/bin/sqlcmd -U $MSSQL_MOTI_USER -P $MSSQL_MOTI_PASSWORD -S $MSSQL_MOTI_HOST -d $MSSQL_MOTI_DB -Q "DELETE FROM dbo.ORBC_USER"
/opt/mssql-tools/bin/sqlcmd -U $MSSQL_MOTI_USER -P $MSSQL_MOTI_PASSWORD -S $MSSQL_MOTI_HOST -d $MSSQL_MOTI_DB -Q "DELETE FROM dbo.ORBC_COMPANY"
/opt/mssql-tools/bin/sqlcmd -U $MSSQL_MOTI_USER -P $MSSQL_MOTI_PASSWORD -S $MSSQL_MOTI_HOST -d $MSSQL_MOTI_DB -Q "DELETE FROM dbo.ORBC_CONTACT"
/opt/mssql-tools/bin/sqlcmd -U $MSSQL_MOTI_USER -P $MSSQL_MOTI_PASSWORD -S $MSSQL_MOTI_HOST -d $MSSQL_MOTI_DB -Q "DELETE FROM dbo.ORBC_ADDRESS"
echo "Finished deleting existing sample data"

echo "Loading sample data...please wait"
/opt/mssql-tools/bin/sqlcmd -U $MSSQL_MOTI_USER -P $MSSQL_MOTI_PASSWORD -S $MSSQL_MOTI_HOST -v MSSQL_DB=$MSSQL_MOTI_DB -i /usr/config/sampledata/dbo.ORBC_ADDRESS.Table.sql
/opt/mssql-tools/bin/sqlcmd -U $MSSQL_MOTI_USER -P $MSSQL_MOTI_PASSWORD -S $MSSQL_MOTI_HOST -v MSSQL_DB=$MSSQL_MOTI_DB -i /usr/config/sampledata/dbo.ORBC_CONTACT.Table.sql
/opt/mssql-tools/bin/sqlcmd -U $MSSQL_MOTI_USER -P $MSSQL_MOTI_PASSWORD -S $MSSQL_MOTI_HOST -v MSSQL_DB=$MSSQL_MOTI_DB -i /usr/config/sampledata/dbo.ORBC_COMPANY.Table.sql
/opt/mssql-tools/bin/sqlcmd -U $MSSQL_MOTI_USER -P $MSSQL_MOTI_PASSWORD -S $MSSQL_MOTI_HOST -v MSSQL_DB=$MSSQL_MOTI_DB -i /usr/config/sampledata/dbo.ORBC_USER.Table.sql
/opt/mssql-tools/bin/sqlcmd -U $MSSQL_MOTI_USER -P $MSSQL_MOTI_PASSWORD -S $MSSQL_MOTI_HOST -v MSSQL_DB=$MSSQL_MOTI_DB -i /usr/config/sampledata/dbo.ORBC_COMPANY_USER.Table.sql
/opt/mssql-tools/bin/sqlcmd -U $MSSQL_MOTI_USER -P $MSSQL_MOTI_PASSWORD -S $MSSQL_MOTI_HOST -v MSSQL_DB=$MSSQL_MOTI_DB -i /usr/config/sampledata/dbo.ORBC_POWER_UNIT.Table.sql
/opt/mssql-tools/bin/sqlcmd -U $MSSQL_MOTI_USER -P $MSSQL_MOTI_PASSWORD -S $MSSQL_MOTI_HOST -v MSSQL_DB=$MSSQL_MOTI_DB -i /usr/config/sampledata/dbo.ORBC_TRAILER.Table.sql
echo "Finished loading sample data"