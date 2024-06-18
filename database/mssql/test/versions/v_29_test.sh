#!/bin/bash

# Retrieve arguments
source ${SCRIPT_DIR}/utility/getopt.sh
USAGE="-u USER -p PASS -s SERVER -d DATABASE"
parse_options "${USAGE}" ${@}

# All database tests for database version 29 are run from this shell script.
# TESTS_DIR variable set by the calling test-runner script.

TEST_29_1_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_29_1_test.sql | xargs)
if [[ $TEST_29_1_RESULT -eq 1 ]]; then
    echo "Test 29.1 passed: Policy configuration tables were created successfully"
else
    echo "******** Test 29.1 failed: Policy configuration table creation failed"
fi

TEST_29_2_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_29_2_test.sql | xargs)
if [[ $TEST_29_2_RESULT -eq 1 ]]; then
    echo "Test 29.2 passed: v27 history tables were created successfully"
else
    echo "******** Test 29.2 failed: v27 history table creation failed"
fi

TEST_29_3_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_29_3_test.sql | xargs)
if [[ $TEST_29_3_RESULT -eq 1 ]]; then
    echo "Test 29.3 passed: v28 history tables were created successfully"
else
    echo "******** Test 29.3 failed: v28 history table creation failed"
fi
