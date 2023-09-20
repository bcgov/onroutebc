#!/bin/bash

echo "Executing unit tests"

source ${SCRIPT_DIR}/utility/orbc-db-functions.sh

# We use the same process as creating the dev db, but create it as its own
# unit test DB that can be dropped immediately after the tests are run.

# The name of the unit test DB will be passed to the test scripts explicitly
UNIT_TEST_DB_NAME=UNIT_TEST_DB

export TESTS_DIR=${SCRIPT_DIR}/test/versions

# Create the unit test DB
echo "Creating ${UNIT_TEST_DB_NAME} database."
/opt/mssql-tools/bin/sqlcmd -U ${MSSQL_SA_USER} -P "${MSSQL_SA_PASSWORD}" -S ${MSSQL_HOST} -d master -Q "CREATE DATABASE ${UNIT_TEST_DB_NAME}"

echo "Executing migration scripts and testing in sequence ..."
nextver=1

#echo "Initial migration file: ${SCRIPT_DIR}/versions/v_${nextver}_ddl.sql"

while test -f "${SCRIPT_DIR}/versions/v_${nextver}_ddl.sql"; do
    migrate_db_single ${MSSQL_SA_USER} "${MSSQL_SA_PASSWORD}" "${MSSQL_HOST}" ${UNIT_TEST_DB_NAME}

    echo "Checking for test ${TESTS_DIR}/v_${nextver}_test.sh"
    if test -f "${TESTS_DIR}/v_${nextver}_test.sh"; then
        echo "Running test ${TESTS_DIR}/v_${nextver}_test.sh"
        ${TESTS_DIR}/v_${nextver}_test.sh -u ${MSSQL_SA_USER} -p "${MSSQL_SA_PASSWORD}" -s ${MSSQL_HOST} -d ${UNIT_TEST_DB_NAME}
    fi
    (( nextver=nextver+1 ))
    #echo "Next migration file to check: ${SCRIPT_DIR}/versions/v_${nextver}_ddl.sql"
done

echo "Testing the revert scripts to ensure tests still pass..."
# Set nextver to the current database version
(( nextver=nextver-1 ))
while test -f "${SCRIPT_DIR}/versions/revert/v_${nextver}_ddl_revert.sql"; do
    revert_db_single ${MSSQL_SA_USER} "${MSSQL_SA_PASSWORD}" "${MSSQL_HOST}" ${UNIT_TEST_DB_NAME}

    (( nextver=nextver-1 ))
    echo "Checking for test ${TESTS_DIR}/v_${nextver}_test.sh"
    if test -f "${TESTS_DIR}/v_${nextver}_test.sh"; then
        echo "Running test ${TESTS_DIR}/v_${nextver}_test.sh"
        ${TESTS_DIR}/v_${nextver}_test.sh -u ${MSSQL_SA_USER} -p "${MSSQL_SA_PASSWORD}" -s ${MSSQL_HOST} -d ${UNIT_TEST_DB_NAME}
    fi
    #echo "Next migration file to check: ${SCRIPT_DIR}/versions/v_${nextver}_ddl.sql"
done

echo "Testing the full migrate db schema script..."
migrate_db_current ${MSSQL_SA_USER} "${MSSQL_SA_PASSWORD}" "${MSSQL_HOST}" ${UNIT_TEST_DB_NAME}

echo "Testing the full revert db schema script..."
revert_db_complete ${MSSQL_SA_USER} "${MSSQL_SA_PASSWORD}" "${MSSQL_HOST}" ${UNIT_TEST_DB_NAME}

echo "Testing the full reset script (including sample data)..."
migrate_db_current ${MSSQL_SA_USER} "${MSSQL_SA_PASSWORD}" "${MSSQL_HOST}" ${UNIT_TEST_DB_NAME}
export TEST_MOTI_USER=${MSSQL_SA_USER}
export TEST_MOTI_PASSWORD="${MSSQL_SA_PASSWORD}"
export TEST_MOTI_HOST=${MSSQL_HOST}
export TEST_MOTI_DB=${UNIT_TEST_DB_NAME}
${SCRIPT_DIR}/utility/reset-moti-db.sh force

/opt/mssql-tools/bin/sqlcmd -U ${MSSQL_SA_USER} -P "${MSSQL_SA_PASSWORD}" -S ${MSSQL_HOST} -d master -Q "DROP DATABASE ${UNIT_TEST_DB_NAME}" 

echo "Finished executing unit tests."