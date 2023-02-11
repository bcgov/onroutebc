#!/bin/bash

# Executes a single version upgrade to the MOTI database. The version to
# upgrade to must be supplied as a parameter to this script.
# Example: 'migrate-moti-db-single-version.sh 3' will upgrade the database
# from version 2 to version 3.

# This script relies on the following environment variables:
#  MSSQL_MOTI_HOST
#  MSSQL_MOTI_DB
#  MSSQL_MOTI_USER
#  MSSQL_MOTI_PASSWORD
# These are all supplied to the docker container from your .env 'secrets' file
# in the project root. See docker-compose.yml for more details.

if [ -z "${1}" ]; then
    echo "ERROR: you must supply a version to migrate to."
    echo "For example: migrate-moti-db-single-version.sh 3"
    exit
fi

# Retrieve the version of the ORBC database from the version history table.
# If the version history table does not exist then a value of zero (0) will
# be returned.
ORBC_DB_VERSION=$(/opt/mssql-tools/bin/sqlcmd -U $MSSQL_MOTI_USER -P $MSSQL_MOTI_PASSWORD -S $MSSQL_MOTI_HOST -v MSSQL_DB=$MSSQL_MOTI_DB -h -1 -i /usr/config/get-orbc-db-version.sql)

echo "ORBC DB Version: $ORBC_DB_VERSION"

# Exit script if current database version is not exactly one behind the
# target version.
((DB_TARGET=${1}-1))
if [[ ORBC_DB_VERSION -ne DB_TARGET ]]; then
    echo "ERROR: the current database version must be exactly one below the target database version."
    exit
fi

if test -f "/usr/config/versions/v_${1}_ddl.sql"; then
    echo "Executing /usr/config/versions/v_${1}_ddl.sql"
    # The FILE_HASH is saved to the database as a verification that the DDL was not altered
    # from what is present in the git repository.
    FILE_HASH=($(sha1sum /usr/config/versions/v_${1}_ddl.sql))
    /opt/mssql-tools/bin/sqlcmd -U $MSSQL_MOTI_USER -P $MSSQL_MOTI_PASSWORD -S $MSSQL_MOTI_HOST -v MSSQL_DB=$MSSQL_MOTI_DB FILE_HASH=${FILE_HASH} -i /usr/config/versions/v_${1}_ddl.sql
else
    echo "ERROR: migration file /usr/config/versions/v_${1}_ddl.sql not found."
    exit
fi

echo "Upgraded database to version ${1}"