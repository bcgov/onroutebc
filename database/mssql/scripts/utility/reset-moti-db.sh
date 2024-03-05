#!/bin/bash

source ${SCRIPT_DIR}/utility/orbc-db-functions.sh

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

if [[ $1 != "force" ]]; then
  echo "You are about to completely reset the ${TEST_MOTI_DB:-$MSSQL_MOTI_DB} database on ${TEST_MOTI_HOST:-$MSSQL_MOTI_HOST} as user ${TEST_MOTI_USER:-$MSSQL_MOTI_USER}."
  echo "This involves reverting the database to a clean state (losing all data), and rebuilding the database to the most current version available."
  if [[ ${MSSQL_RUN_TESTS} -eq 1 ]]; then
    echo "Sample data will be loaded into the database once it has been rebuilt."
  else
    echo "To load sample data into the database once it has been rebuilt set the MSSQL_LOAD_SAMPLE_DATA environment variable to 1."
  fi
  echo "THIS IS A DESTRUCTIVE OPERATION!"
  read -p "Are you sure you want to completely reset the database? [yes | no] "
fi

if [[ "${REPLY}" == "yes" ]] || [[ $1 == "force" ]]; then
  echo "Beginning full reset of the ${TEST_MOTI_DB:-$MSSQL_MOTI_DB} database on ${TEST_MOTI_HOST:-$MSSQL_MOTI_HOST} as user ${TEST_MOTI_USER:-$MSSQL_MOTI_USER}"

  revert_db_complete ${TEST_MOTI_USER:-$MSSQL_MOTI_USER} "${TEST_MOTI_PASSWORD:-$MSSQL_MOTI_PASSWORD}" "${TEST_MOTI_HOST:-$MSSQL_MOTI_HOST}" ${TEST_MOTI_DB:-$MSSQL_MOTI_DB}
  if (( $? > 0 )); then
    echo "Error reverting ORBC database; exiting."
    exit 1
  fi

  migrate_db_current ${TEST_MOTI_USER:-$MSSQL_MOTI_USER} "${TEST_MOTI_PASSWORD:-$MSSQL_MOTI_PASSWORD}" "${TEST_MOTI_HOST:-$MSSQL_MOTI_HOST}" ${TEST_MOTI_DB:-$MSSQL_MOTI_DB}
  if (( $? > 0 )); then
    echo "Error migrating ORBC database to most current; exiting."
    exit 1
  fi

  if [[ ${MSSQL_LOAD_SAMPLE_DATA} -eq 1 ]]; then
    ${SCRIPT_DIR}/utility/refresh-sample-data.sh -u ${TEST_MOTI_USER:-$MSSQL_MOTI_USER} -p '"${TEST_MOTI_PASSWORD:-$MSSQL_MOTI_PASSWORD}"' -s ${TEST_MOTI_HOST:-$MSSQL_MOTI_HOST} -d ${TEST_MOTI_DB:-$MSSQL_MOTI_DB}
    ${SCRIPT_DIR}/utility/refresh-sample-idir-users.sh -u ${TEST_MOTI_USER:-$MSSQL_MOTI_USER} -p '"${TEST_MOTI_PASSWORD:-$MSSQL_MOTI_PASSWORD}"' -s ${TEST_MOTI_HOST:-$MSSQL_MOTI_HOST} -d ${TEST_MOTI_DB:-$MSSQL_MOTI_DB}
  fi

  echo "Finished reset of ORBC database."
else
  echo "User cancelled"
  exit 1
fi
