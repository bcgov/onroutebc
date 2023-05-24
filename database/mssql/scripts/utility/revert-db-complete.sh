#!/bin/bash

# Retrieve arguments
source ${SCRIPT_DIR}/utility/getopt.sh
USAGE="-u USER -p PASS -s SERVER -d DATABASE"
parse_options "${USAGE}" ${@}

# Resets the database schema in the MOTI hosted database from the schema
# DDL files in the versions/revert directory.

# This script should only be done in a non-production database because it will
# wipe any data that currently exists (all tables will be dropped).

# This is intended to be run from the local docker sql-server-db container, or
# a similar linux environment with the requisite env variables and sqlcmd
# installed in /opt/mssql-tools/bin/. Note you must be connected to the BC Gov
# Citrix VPN in order for the connection to be established.

# Retrieve the version of the ORBC database from the version history table.
# If the version history table does not exist then a value of zero (0) will
# be returned.
ORBC_DB_VERSION=$(sqlcmd -U ${USER} -P ${PASS} -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${SCRIPT_DIR}/get-orbc-db-version.sql)

echo "ORBC DB Version: ${ORBC_DB_VERSION}"

# Execute all revert sql files in sequence, starting with the current db version.
# DDL file names match the following pattern: v_N_ddl_revert.sql where N is the 
# current database version.
# Example: v_2_ddl_revert.sql will revert the database from version 2 to version 1.

# This script assumes a SCRIPT_DIR environment variable has been set, indicating the
# root database scripts directory.
# DDL files must be in the database/mssql/scripts/versions/revert directory in
# git, and in ${SCRIPT_DIR}/versions/revert directory on the computer this script
# is running on.
echo "Reverting database to empty state..."
((NEXTVER=ORBC_DB_VERSION))
echo "Initial revert file to look for: ${SCRIPT_DIR}/versions/revert/v_${NEXTVER}_ddl_revert.sql"

while test -f "${SCRIPT_DIR}/versions/revert/v_${NEXTVER}_ddl_revert.sql"; do
    ${SCRIPT_DIR}/utility/revert-db-single.sh -v ${NEXTVER} -u ${USER} -p "${PASS}" -s ${SERVER} -d ${DATABASE}
    ((NEXTVER=NEXTVER-1))
    echo "Next revert file to check: ${SCRIPT_DIR}/versions/revert/v_${NEXTVER}_ddl_revert.sql"
done

echo "Finished reverting database to empty state"
