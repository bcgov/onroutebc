#!/bin/bash

# Retrieve arguments
source ${SCRIPT_DIR}/utility/getopt.sh
USAGE="-u USER -p PASS -s SERVER -d DATABASE"
parse_options "${USAGE}" ${@}

# All database tests for database version 71 are run from this shell script.
# TESTS_DIR variable set by the calling test-runner script.

TEST_71_1_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_71_1_test.sql | xargs)
if [[ $TEST_71_1_RESULT -eq 15 ]]; then
    echo "Test 71.1 passed: POSTAL_CODE column length updated correctly"
else
    echo "******** Test 71.1 failed: POSTAL_CODE column length not updated correctly: "
    echo $TEST_71_1_RESULT
fi

TEST_71_2_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_71_2_test.sql | xargs)
if [[ $TEST_71_2_RESULT -eq 15 ]]; then
    echo "Test 71.2 passed: POSTAL_CODE column length updated correctly"
else
    echo "******** Test 71.2 failed: POSTAL_CODE column length not updated correctly: "
    echo $TEST_71_2_RESULT
fi