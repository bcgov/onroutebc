#!/bin/bash

# Retrieve arguments
source ${SCRIPT_DIR}/utility/getopt.sh
USAGE="-u USER -p PASS -s SERVER -d DATABASE"
parse_options "${USAGE}" ${@}

# All database tests for database version 7 are run from this shell script.
# TESTS_DIR variable set by the calling test-runner script.

# Test 7.1 - verify that the transaction table exists
TEST_7_1_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_7_1_test.sql)

if [[ $TEST_7_1_RESULT -eq 1 ]]; then
    echo "Test 7.1 passed: All ORBC transaction tables exist"
else
    echo "******** Test 7.1 failed: Missing one or more ORBC transaction tables"
fi

