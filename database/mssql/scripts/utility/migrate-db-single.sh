#!/bin/bash

# Retrieve arguments
source ${SCRIPT_DIR}/utility/getopt.sh
USAGE="-v VERSION -u USER -p PASS -s SERVER -d DATABASE"
parse_options "${USAGE}" ${@}

# Executes a single version upgrade to the ORBC database. The version to
# upgrade to must be supplied as a parameter to this script, as do the connection
# details and credentials.
# Example: 'migrate-db-single.sh -v 3 -u <user> -p <pass> -s <server> -d <database>'
# will upgrade the database from version 2 to version 3.

# Retrieve the version of the ORBC database from the version history table.
# If the version history table does not exist then a value of zero (0) will
# be returned.
ORBC_DB_VERSION=$(sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${SCRIPT_DIR}/get-orbc-db-version.sql)

echo "ORBC DB Version: ${ORBC_DB_VERSION}"

# Exit script if current database version is not exactly one behind the
# target version.
((DB_TARGET=${VERSION}-1))
if [[ ORBC_DB_VERSION -ne DB_TARGET ]]; then
    echo "ERROR: the current database version must be exactly one below the target database version."
    exit
fi

if test -f "${SCRIPT_DIR}/versions/v_${VERSION}_ddl.sql"; then
    echo "Executing ${SCRIPT_DIR}/versions/v_${VERSION}_ddl.sql"
    # The FILE_HASH is saved to the database as a verification that the DDL was not altered
    # from what is present in the git repository.
    FILE_HASH=($(sha1sum ${SCRIPT_DIR}/versions/v_${VERSION}_ddl.sql))
    sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -d ${DATABASE} -v FILE_HASH=${FILE_HASH} -i ${SCRIPT_DIR}/versions/v_${VERSION}_ddl.sql
else
    echo "ERROR: migration file ${SCRIPT_DIR}/versions/v_${VERSION}_ddl.sql not found."
    exit
fi

echo "Upgraded database to version ${VERSION}"
