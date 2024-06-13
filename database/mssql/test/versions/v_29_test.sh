#!/bin/bash

# Retrieve arguments
source ${SCRIPT_DIR}/utility/getopt.sh
USAGE="-u USER -p PASS -s SERVER -d DATABASE"
parse_options "${USAGE}" ${@}

# All database tests for database version 30 are run from this shell script.
# TESTS_DIR variable set by the calling test-runner script.

TEST_29_1_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_29_1_test.sql | xargs)
if [[ $TEST_29_1_RESULT -eq 1 ]]; then
    echo "Test 30.1 passed: Directory type inserted correctly"
else
    echo "******** Test 30.1 failed: Directory type not inserted correctly"
fi

TEST_29_2_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_29_2_test.sql | xargs)
if [[ $TEST_29_2_RESULT -eq 1 ]]; then
    echo "Test 30.1 passed: Directory type inserted correctly"
else
    echo "******** Test 30.1 failed: Directory type not inserted correctly"
fi
