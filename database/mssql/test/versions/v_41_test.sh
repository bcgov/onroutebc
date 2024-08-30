#!/bin/bash

# Retrieve arguments
source ${SCRIPT_DIR}/utility/getopt.sh
USAGE="-u USER -p PASS -s SERVER -d DATABASE"
parse_options "${USAGE}" ${@}

# All database tests for database version 41 are run from this shell script.
# TESTS_DIR variable set by the calling test-runner script.

TEST_41_1_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_41_1_test.sql | xargs)
if [[ $TEST_41_1_RESULT -eq 4 ]]; then
    echo "Test 41.1 passed: New column for previous LoA id have been added successfully"
else
    echo "******** Test 41.1 failed: Failed to add new column for previous LoA id"
fi


TEST_41_2_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_41_2_test.sql | xargs)
if [[ $TEST_41_2_RESULT -eq 4 ]]; then
    echo "Test 41.2 passed: New column for original LoA id have been added successfully"
else
    echo "******** Test 41.2 failed: Failed to add new column for original LoA id"
fi

TEST_41_3_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_41_3_test.sql | xargs)
if [[ $TEST_41_3_RESULT -eq date ]]; then
    echo "Test 41.3 passed: Type of column start_date updated to date successfully"
else
    echo "******** Test 41.3 failed: Failed to update column start_date type to date"
fi

TEST_41_4_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_41_4_test.sql | xargs)
if [[ $TEST_41_4_RESULT -eq date ]]; then
    echo "Test 41.4 passed: Type of column expiry_date updated to date successfully"
else
    echo "******** Test 41.4 failed: Failed to update column expiry_date type to date"
fi