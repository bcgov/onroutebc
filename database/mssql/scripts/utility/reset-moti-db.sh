#!/bin/bash

# Resets the database schema in the MOTI hosted database from the schema
# DDL files in the versions/ directory. This involves reverting the schema
# using the revert sql files to get to a clean (empty) database state, then
# running the version schema files in sequence just like is done when the
# docker sql server container starts up with local development.

# This script relies on the following environment variables:
#  MSSQL_MOTI_HOST
#  MSSQL_MOTI_DB
#  MSSQL_MOTI_USER
#  MSSQL_MOTI_PASSWORD
# These are all supplied to the docker container from your .env 'secrets' file
# in the project root. See docker-compose.yml for more details.

# Note that the variables can be overridden with TEST_MOTI_HOST, TEST_MOTI_DB,
# TEST_MOTI_USER, and TEST_MOTI_PASSWORD respectively but this is only generally
# used by the automated unit tests. 

# Once the database has been refreshed, loads in the sample data.

# This script should only be done in a non-production database because it will
# wipe any data that currently exists (all tables will be dropped first).

# This is intended to be run from the local docker sql-server-db container, or
# a similar linux environment with the requisite env variables and sqlcmd
# installed in /opt/mssql-tools/bin/. Note you must be connected to the BC Gov
# Citrix VPN in order for the connection to be established.

echo "Beginning reset of ORBC database..."

${SCRIPT_DIR}/utility/revert-db-complete.sh -u ${TEST_MOTI_USER:=$MSSQL_MOTI_USER} -p "${TEST_MOTI_PASSWORD:=$MSSQL_MOTI_PASSWORD}" -s ${TEST_MOTI_HOST:=$MSSQL_MOTI_HOST} -d ${TEST_MOTI_DB:=$MSSQL_MOTI_DB}
${SCRIPT_DIR}/utility/migrate-db-current.sh -u ${TEST_MOTI_USER:=$MSSQL_MOTI_USER} -p "${TEST_MOTI_PASSWORD:=$MSSQL_MOTI_PASSWORD}" -s ${TEST_MOTI_HOST:=$MSSQL_MOTI_HOST} -d ${TEST_MOTI_DB:=$MSSQL_MOTI_DB}
${SCRIPT_DIR}/utility/refresh-sample-data.sh -u ${TEST_MOTI_USER:=$MSSQL_MOTI_USER} -p "${TEST_MOTI_PASSWORD:=$MSSQL_MOTI_PASSWORD}" -s ${TEST_MOTI_HOST:=$MSSQL_MOTI_HOST} -d ${TEST_MOTI_DB:=$MSSQL_MOTI_DB}

echo "Finished reset of ORBC database."