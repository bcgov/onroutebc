#!/bin/bash

# Retrieve arguments
source ${SCRIPT_DIR}/utility/getopt.sh
USAGE="-u USER -p PASS -s SERVER -d DATABASE"
parse_options "${USAGE}" ${@}

# All database tests for database version 24 are run from this shell script.
# TESTS_DIR variable set by the calling test-runner script.

TEST_24_1_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_24_1_test.sql | xargs)
if [[ $TEST_24_1_RESULT -eq 3 ]]; then
    echo "Test 24.1 passed: Template names updated correctly"
else
    echo "******** Test 24.1 failed: Template names not updated correctly"
fi

TEST_24_2_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_24_2_test.sql | xargs)
if [[ $TEST_24_2_RESULT -eq 3 ]]; then
    echo "Test 24.2 passed: File names updated correctly"
else
    echo "******** Test 24.2 failed: File names not updated correctly"
fi
