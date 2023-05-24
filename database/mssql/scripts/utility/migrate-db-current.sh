#!/bin/bash

# Retrieve arguments
source ${SCRIPT_DIR}/utility/getopt.sh
USAGE="-u USER -p PASS -s SERVER -d DATABASE"
parse_options "${USAGE}" ${@}

# Migrates the schema in the ORBC database using the schema DDL files in the
# versions directory.

# This is intended to be run from the local docker sql-server-db container, or
# a similar linux environment with the requisite env variables and sqlcmd
# installed in /opt/mssql-tools/bin/.

# Retrieve the version of the ORBC database from the version history table.
# If the version history table does not exist then a value of zero (0) will
# be returned.
ORBC_DB_VERSION=$(sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${SCRIPT_DIR}/get-orbc-db-version.sql)

echo "ORBC DB Version: ${ORBC_DB_VERSION}"

# Look for new database version DDL files, and execute them in sequence when found.
# DDL file names match the following pattern: v_N_ddl.sql where N is the version the
# database will be brought up to after execution.
# Example: v_2_ddl.sql will migrate the database from version 1 to version 2.

# This script assumes a SCRIPT_DIR environment variable has been set, indicating the
# root database scripts directory.
# DDL files are kept in the database/mssql/scripts/versions/ directory, and are copied
# into the ${SCRIPT_DIR}/versions/ directory in the container when built.
echo "Bringing database schema up to most current version available"
((NEXTVER=ORBC_DB_VERSION+1))
echo "Initial migration file to look for: ${SCRIPT_DIR}/versions/v_${NEXTVER}_ddl.sql"

while test -f "${SCRIPT_DIR}/versions/v_${NEXTVER}_ddl.sql"; do
    ${SCRIPT_DIR}/utility/migrate-db-single.sh -v ${NEXTVER} -u ${USER} -p "${PASS}" -s ${SERVER} -d ${DATABASE}
    ((NEXTVER=NEXTVER+1))
    echo "Next migration file to check: ${SCRIPT_DIR}/versions/v_${NEXTVER}_ddl.sql"
done

echo "Finished migrating database to the most current version."
