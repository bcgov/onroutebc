#!/bin/bash

echo "onRouteBC database connection details:"
echo "MSSQL_MOTI_USER variable: ${MSSQL_MOTI_USER}"
echo "MSSQL_MOTI_HOST variable: ${MSSQL_MOTI_HOST}"
echo "MSSQL_MOTI_DB variable: ${MSSQL_MOTI_DB}"
[[ -z "${MSSQL_MOTI_PASSWORD}" ]] && echo "MSSQL_MOTI_PASSWORD variable is *NOT* set" || echo "MSSQL_MOTI_PASSWORD variable is set"
echo
echo "SCRIPT_DIR variable: ${SCRIPT_DIR}"
sqlcmd_loc=$( type -p sqlcmd )
[[ -z "${sqlcmd_loc}" ]] && echo "sqlcmd utility not installed or not on path" || echo "sqlcmd utility found"

if [[ -f ${SCRIPT_DIR}/utility/orbc-db-functions.sh ]]; then
  source ${SCRIPT_DIR}/utility/orbc-db-functions.sh

  get_orbc_db_version ${USER:-$MSSQL_MOTI_USER} "${PASS:-$MSSQL_MOTI_PASSWORD}" "${SERVER:-$MSSQL_MOTI_HOST}" ${DATABASE:-$MSSQL_MOTI_DB}
  if (( $? > 0 )); then
    echo "Could not retrieve onRouteBC database version"
  else
    echo "onRouteBC database version: ${orbc_db_version}"
  fi

  get_max_db_version
  if (( $? > 0 )); then
    echo "Could not retrieve maximum onRouteBC database version"
  else
    echo "onRouteBC maximum database version: ${orbc_max_db_version}"
  fi
else
  echo "Could not retrieve onRouteBC database version; SCRIPT_DIR variable not set correctly?"
fi
