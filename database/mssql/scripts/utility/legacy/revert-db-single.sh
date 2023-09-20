#!/bin/bash

# Retrieve arguments
source ${SCRIPT_DIR}/utility/getopt.sh
USAGE="-v VERSION -u USER -p PASS -s SERVER -d DATABASE"
parse_options "${USAGE}" ${@}

# Reverts a single version upgrade to the MOTI database. The version to
# revert from must be supplied as a parameter to this script, as do the
# connection details and credentials.
# Example: 'revert-db-single.sh -v 3 -u <user> -p <pass> -s <server> -d <database>'
# will revert the database from version 3 to version 2.

# Retrieve the version of the ORBC database from the version history table.
# If the version history table does not exist then a value of zero (0) will
# be returned.
ORBC_DB_VERSION=$(sqlcmd -C -U ${USER} -P ${PASS} -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${SCRIPT_DIR}/get-orbc-db-version.sql)

echo "**LEGACY** ORBC DB Version: ${ORBC_DB_VERSION}"

# Exit script if current database version does not match the version to revert.
if [[ ORBC_DB_VERSION -ne ${VERSION} ]]; then
    echo "**LEGACY** ERROR: the current database version must match the version to revert."
    exit
fi

if test -f "${SCRIPT_DIR}/versions/revert/v_${VERSION}_ddl_revert.sql"; then
    echo "**LEGACY** Executing ${SCRIPT_DIR}/versions/revert/v_${VERSION}_ddl_revert.sql"
    sqlcmd -C -U ${USER} -P "${PASS}" -S ${SERVER} -d ${DATABASE} -i ${SCRIPT_DIR}/versions/revert/v_${VERSION}_ddl_revert.sql
else
    echo "**LEGACY** ERROR: migration file ${SCRIPT_DIR}/versions/revert/v_${VERSION}_ddl_revert.sql not found."
    exit
fi

((NEW_DB_VERSION=${VERSION}-1))
echo "**LEGACY** Reverted database to version ${NEW_DB_VERSION}"
