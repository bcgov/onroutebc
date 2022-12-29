#!/bin/bash

echo "Executing unit tests"

# We use the same process as creating the dev db, but create it as its own
# unit test DB that can be dropped immediately after the tests are run.

# The name of the unit test DB will be passed to the test scripts explicitly
UNIT_TEST_DB_NAME=UNIT_TEST_DB

TESTS_DIR=/usr/config/test/versions

# Create the unit test DB
echo "Creating $UNIT_TEST_DB_NAME database using $MSSQL_INIT_DDL_FILENAME ..."
/opt/mssql-tools/bin/sqlcmd -U $MSSQL_SA_USER -P $MSSQL_SA_PASSWORD -d master -v MSSQL_DB=${UNIT_TEST_DB_NAME} -i /usr/config/$MSSQL_INIT_DDL_FILENAME

echo "Executing migration scripts and testing in sequence ..."
NEXTVER=1
echo "Initial migration file: /usr/config/versions/v_${NEXTVER}_ddl.sql"

while test -f "/usr/config/versions/v_${NEXTVER}_ddl.sql"; do
    echo "Executing /usr/config/versions/v_${NEXTVER}_ddl.sql"
    # The FILE_HASH is saved to the database as a verification that the DDL was not altered
    # from what is present in the git repository.
    FILE_HASH=($(sha1sum /usr/config/versions/v_${NEXTVER}_ddl.sql))
    /opt/mssql-tools/bin/sqlcmd -U $MSSQL_SA_USER -P $MSSQL_SA_PASSWORD -v VERSION_ID=${NEXTVER} FILE_HASH=${FILE_HASH} MSSQL_DB=${UNIT_TEST_DB_NAME} -i /usr/config/versions/v_${NEXTVER}_ddl.sql

    echo "Checking for test ${TESTS_DIR}/v_${NEXTVER}_test.sh"
    if test -f "${TESTS_DIR}/v_${NEXTVER}_test.sh"; then
        echo "Running test ${TESTS_DIR}/v_${NEXTVER}_test.sh"
        ${TESTS_DIR}/v_${NEXTVER}_test.sh $UNIT_TEST_DB_NAME
    fi
    ((NEXTVER=NEXTVER+1))
    echo "Next migration file to check: /usr/config/versions/v_${NEXTVER}_ddl.sql"
done

/opt/mssql-tools/bin/sqlcmd -U $MSSQL_SA_USER -P $MSSQL_SA_PASSWORD -d master -Q "DROP DATABASE ${UNIT_TEST_DB_NAME}" 