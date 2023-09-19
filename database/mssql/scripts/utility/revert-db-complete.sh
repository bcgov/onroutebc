#!/bin/bash

# This script should only be done in a non-production database because it will
# wipe any data that currently exists (all tables will be dropped).

# This is intended to be run from the local docker sql-server-db container, or
# a similar linux environment with the requisite env variables and sqlcmd
# installed and in the $PATH. Note you must be connected to the BC Gov
# Citrix VPN in order for the connection to be established.

source ${SCRIPT_DIR}/utility/orbc-db-functions.sh
source ${SCRIPT_DIR}/utility/getopt.sh

# Retrieve arguments
USAGE="[-u USER] [-p PASS] [-s SERVER] [-d DATABASE]"
parse_options "${USAGE}" ${@}

get_orbc_db_version ${USER:-$MSSQL_MOTI_USER} "${PASS:-$MSSQL_MOTI_PASSWORD}" "${SERVER:-$MSSQL_MOTI_HOST}" ${DATABASE:-$MSSQL_MOTI_DB}
if (( $? > 0 )); then
  echo "Could not retrieve orbc db version, exiting revert script."
  exit 1
fi

if (( orbc_db_version > 0 )); then
  echo "You are about to completely revert the ORBC database at ${SERVER:-$MSSQL_MOTI_HOST} from version ${orbc_db_version} to version 0 (empty state)"
  echo "THIS IS A DESTRUCTIVE OPERATION!"
  read -p "Are you sure you want to completely revert the database? [yes | no] "

  if [[ "${REPLY}" == "yes" ]]; then
    revert_db_complete ${USER:-$MSSQL_MOTI_USER} "${PASS:-$MSSQL_MOTI_PASSWORD}" "${SERVER:-$MSSQL_MOTI_HOST}" ${DATABASE:-$MSSQL_MOTI_DB}
    if (( $? > 0 )); then
      echo "Could not revert database"
      exit 1
    else
      echo "Reverted ORBC database to version 0"
    fi
  else
    echo "User cancelled"
    exit 1
  fi
else
  echo "ORBC database already at version zero; nothing to revert."
fi
