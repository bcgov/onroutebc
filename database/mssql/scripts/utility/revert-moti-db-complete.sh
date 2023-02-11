#!/bin/bash

# Resets the database schema in the MOTI hosted database from the schema
# DDL files in the versions/revert directory.

# This script should only be done in a non-production database because it will
# wipe any data that currently exists (all tables will be dropped).

# This script relies on the following environment variables:
#  MSSQL_MOTI_HOST
#  MSSQL_MOTI_DB
#  MSSQL_MOTI_USER
#  MSSQL_MOTI_PASSWORD
# These are all supplied to the docker container from your .env 'secrets' file
# in the project root. See docker-compose.yml for more details.

# This is intended to be run from the local docker sql-server-db container, or
# a similar linux environment with the requisite env variables and sqlcmd
# installed in /opt/mssql-tools/bin/. Note you must be connected to the BC Gov
# Citrix VPN in order for the connection to be established.

# Retrieve the version of the ORBC database from the version history table.
# If the version history table does not exist then a value of zero (0) will
# be returned.
ORBC_DB_VERSION=$(/opt/mssql-tools/bin/sqlcmd -U $MSSQL_MOTI_USER -P $MSSQL_MOTI_PASSWORD -S $MSSQL_MOTI_HOST -v MSSQL_DB=$MSSQL_MOTI_DB -h -1 -i /usr/config/get-orbc-db-version.sql)

echo "ORBC DB Version: $ORBC_DB_VERSION"

# Execute all revert sql files in sequence, starting with the current db version.
# DDL file names match the following pattern: v_N_ddl_revert.sql where N is the 
# current database version.
# Example: v_2_ddl_revert.sql will revert the database from version 2 to version 1.

# DDL files must be in the database/mssql/scripts/versions/revert directory in
# git, and in /usr/config/versions/revert directory on the computer this script
# is running on.
echo "Reverting database to empty state..."
((NEXTVER=ORBC_DB_VERSION))
echo "Initial revert file to look for: /usr/config/versions/revert/v_${NEXTVER}_ddl_revert.sql"

while test -f "/usr/config/versions/revert/v_${NEXTVER}_ddl_revert.sql"; do
    /usr/config/utility/migrate-moti-db-single-version.sh ${NEXTVER}
    ((NEXTVER=NEXTVER-1))
    echo "Next revert file to check: /usr/config/versions/revert/v_${NEXTVER}_ddl_revert.sql"
done

echo "Finished reverting database to empty state"