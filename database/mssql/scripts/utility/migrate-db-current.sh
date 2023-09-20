#!/bin/bash

source ${SCRIPT_DIR}/utility/orbc-db-functions.sh
source ${SCRIPT_DIR}/utility/getopt.sh

# Retrieve arguments
USAGE="[-u ORBC_USER] [-p ORBC_PASS] [-s ORBC_SERVER] [-d ORBC_DATABASE]"
parse_options "${USAGE}" ${@}

get_orbc_db_version ${ORBC_USER:-$MSSQL_MOTI_USER} "${ORBC_PASS:-$MSSQL_MOTI_PASSWORD}" "${ORBC_SERVER:-$MSSQL_MOTI_HOST}" ${ORBC_DATABASE:-$MSSQL_MOTI_DB}
if (( $? > 0 )); then
  echo "Could not retrieve orbc db version, exiting migrate script."
  exit 1
fi

get_max_db_version
if (( $? > 0 )); then
  echo "Could not retrieve max db version, exiting migrate script."
  exit 1
fi

if (( orbc_db_version < orbc_max_db_version )); then
  echo "You are about to migrate the ${ORBC_DATABASE:-$MSSQL_MOTI_DB} database on ${ORBC_SERVER:-$MSSQL_MOTI_HOST} as user ${ORBC_USER:-$MSSQL_MOTI_USER} from version ${orbc_db_version} to version ${orbc_max_db_version}"
  echo_param_usage
  read -p "Are you sure you want to migrate the database? [yes | no] "
  if [[ "${REPLY}" == "yes" ]]; then
    migrate_db_current ${ORBC_USER:-$MSSQL_MOTI_USER} "${ORBC_PASS:-$MSSQL_MOTI_PASSWORD}" "${ORBC_SERVER:-$MSSQL_MOTI_HOST}" ${ORBC_DATABASE:-$MSSQL_MOTI_DB}
    if (( $? > 0 )); then
      echo "Could not migrate database"
      exit 1
    else
      echo "Migrated ORBC database to version ${orbc_max_db_version}."
    fi
  else
    echo "User cancelled"
    exit 1
  fi
else
  echo "There are no higher database versions available (db currently at version ${orbc_db_version})"
fi