#!/bin/bash

# Retrieve arguments
source ${SCRIPT_DIR}/utility/getopt.sh
USAGE="-u USER -p PASS -s SERVER -d DATABASE"
parse_options "${USAGE}" ${@}

# All database tests for database version 5 are run from this shell script.
# TESTS_DIR variable set by the calling test-runner script.

# Test 5.1 - verify that the pdf template table exists
TEST_5_1_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_5_1_test.sql)

if [[ $TEST_5_1_RESULT -eq 1 ]]; then
    echo "Test 5.1 passed: The PDF Template table exists"
else
    echo "******** Test 5.1 failed: Missing the PDF Template table"
fi
