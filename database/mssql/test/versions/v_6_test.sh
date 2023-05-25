#!/bin/bash

# Retrieve arguments
source ${SCRIPT_DIR}/utility/getopt.sh
USAGE="-u USER -p PASS -s SERVER -d DATABASE"
parse_options "${USAGE}" ${@}

# All database tests for database version 6 are run from this shell script.
# TESTS_DIR variable set by the calling test-runner script.

# Test 6.1 - verify that the pdf template table exists
TEST_6_1_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_6_1_test.sql)

if [[ $TEST_5_1_RESULT -eq 1 ]]; then
    echo "Test 6.1 passed: The Document Management System (DMS) tables exists"
else
    echo "******** Test 6.1 failed: Missing the Document Management System (DMS) tables"
fi
