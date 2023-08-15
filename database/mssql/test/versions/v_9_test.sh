#!/bin/bash

# Retrieve arguments
source ${SCRIPT_DIR}/utility/getopt.sh
USAGE="-u USER -p PASS -s SERVER -d DATABASE"
parse_options "${USAGE}" ${@}

# All database tests for database version 9 are run from this shell script.
# TESTS_DIR variable set by the calling test-runner script.

# Test 9.1 - verify that the error table exists
TEST_9_1_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_9_1_test.sql)

if [[ $TEST_9_1_RESULT -eq 1 ]]; then
    echo "Test 9.1 passed: All ORBC error tables exist"
else
    echo "******** Test 9.1 failed: Missing one or more ORBC error tables"
fi

