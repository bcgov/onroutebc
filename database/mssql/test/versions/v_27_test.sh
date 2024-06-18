#!/bin/bash

# Retrieve arguments
source ${SCRIPT_DIR}/utility/getopt.sh
USAGE="-u USER -p PASS -s SERVER -d DATABASE"
parse_options "${USAGE}" ${@}

# All database tests for database version 27 are run from this shell script.
# TESTS_DIR variable set by the calling test-runner script.

# Test 27.1 - verify that the Cfs Transaction Details table exists
TEST_27_1_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_27_1_test.sql)

if [[ $TEST_27_1_RESULT -eq 1 ]]; then
    echo "Test 27.1 passed: All ORBC Cfs Transaction Details tables exist"
else
    echo "******** Test 27.1 failed: Missing one or more ORBC Cfs Transaction Details tables"
fi

