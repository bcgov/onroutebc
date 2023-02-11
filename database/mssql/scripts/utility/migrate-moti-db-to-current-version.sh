#!/bin/bash

# Migrates the database schema in the MOTI hosted database from the schema
# DDL files in the versions directory.

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

# Look for new database version DDL files, and execute them in sequence when found.
# DDL file names match the following pattern: v_N_ddl.sql where N is the version the
# database will be brought up to after execution.
# Example: v_2_ddl.sql will migrate the database from version 1 to version 2.

# DDL files are kept in the database/mssql/scripts/versions/ directory, and are copied
# into the /usr/config/versions/ directory in the container when built.
echo "Bringing database schema up to most current version available"
((NEXTVER=ORBC_DB_VERSION+1))
echo "Initial migration file to look for: /usr/config/versions/v_${NEXTVER}_ddl.sql"

while test -f "/usr/config/versions/v_${NEXTVER}_ddl.sql"; do
    /usr/config/utility/migrate-moti-db-single-version.sh ${NEXTVER}
    ((NEXTVER=NEXTVER+1))
    echo "Next migration file to check: /usr/config/versions/v_${NEXTVER}_ddl.sql"
done

echo "Finished migrating database to the most current version."