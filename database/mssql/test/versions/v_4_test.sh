#!/bin/bash

# Retrieve arguments
source ${SCRIPT_DIR}/utility/getopt.sh
USAGE="-u USER -p PASS -s SERVER -d DATABASE"
parse_options "${USAGE}" ${@}

# All database tests for database version 4 are run from this shell script.
# TESTS_DIR variable set by the calling test-runner script.

# Test 4.1 - verify all initial permit tables exist
TEST_4_1_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_4_1_test.sql)

if [[ $TEST_4_1_RESULT -eq 1 ]]; then
    echo "Test 4.1 passed: All ORBC permit tables exist"
else
    echo "******** Test 4.1 failed: Missing one or more ORBC permit tables"
fi