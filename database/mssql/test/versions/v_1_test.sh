#!/bin/bash

# Retrieve arguments
source ${SCRIPT_DIR}/utility/getopt.sh
USAGE="-u USER -p PASS -s SERVER -d DATABASE"
parse_options "${USAGE}" ${@}

# All database tests for database version 2 are run from this shell script.

TESTS_DIR=${SCRIPT_DIR}/test/versions

# Test 1.1 - verify the version table exists
TEST_1_1_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_1_1_test.sql)

if [[ $TEST_1_1_RESULT -eq 1 ]]; then
    echo "Test 1.1 passed: ORBC_SYS_VERSION table exists"
else
    echo "******** Test 1.1 failed: ORBC_SYS_VERSION table does not exist"
fi