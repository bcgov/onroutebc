#!/bin/bash

# Refreshes the database schema in the MOTI hosted database from the schema
# DDL files in the versions/ directory. This involves reverting the schema
# using the revert sql files to get to a clean (empty) database state, then
# running the version schema files in sequence just like is done when the
# docker sql server container starts up with local development.

# This script should only be done in a non-production database because it will
# wipe any data that currently exists (all tables will be dropped first).

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

echo "Refreshing database schema in MOTI-hosted ORBC development database..."

# Retrieve the version of the ORBC database from the version history table.
# If the version history table does not exist then a value of zero (0) will
# be returned.
ORBC_DB_VERSION=$(/opt/mssql-tools/bin/sqlcmd -U $MSSQL_MOTI_USER -P $MSSQL_MOTI_PASSWORD -S $MSSQL_MOTI_HOST -v MSSQL_DB=$MSSQL_MOTI_DB -h -1 -i /usr/config/get-orbc-db-version.sql)

echo "ORBC DB Version: $ORBC_DB_VERSION"
