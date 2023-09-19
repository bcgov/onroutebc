#!/bin/bash

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
  echo "You are about to revert the ${DATABASE:-$MSSQL_MOTI_DB} database on ${SERVER:-$MSSQL_MOTI_HOST} as user ${USER:-$MSSQL_MOTI_USER} from version ${orbc_db_version} to version $(( $orbc_db_version-1 ))"
  echo_param_usage
  echo "THIS IS A DESTRUCTIVE OPERATION!"
  read -p "Are you sure you want to revert the database? [yes | no] "
  
  if [[ "${REPLY}" == "yes" ]]; then
    revert_db_single ${USER:-$MSSQL_MOTI_USER} "${PASS:-$MSSQL_MOTI_PASSWORD}" "${SERVER:-$MSSQL_MOTI_HOST}" ${DATABASE:-$MSSQL_MOTI_DB}
    if (( $? > 0 )); then
      echo "Could not revert database version."
    else
      echo "Reverted ORBC database to version $(( $orbc_db_version-1 ))"
    fi
  else
    echo "User cancelled"
  fi
else
  echo "ORBC database already at version zero; nothing to revert."
fi
