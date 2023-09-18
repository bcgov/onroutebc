#!/bin/bash

# Retrieves the current orbc db version from the versions table
function get_orbc_db_version() {
  local ver=$(sqlcmd -C -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${SCRIPT_DIR}/get-orbc-db-version.sql)
  echo "ORBC DB Version: ${ORBC_DB_VERSION}"
  return ver
}