#!/bin/bash

# Retrieve arguments
source ${SCRIPT_DIR}/utility/getopt.sh
USAGE="-u USER -p PASS -s SERVER -d DATABASE"
parse_options "${USAGE}" ${@}

# All database tests for database version 41 are run from this shell script.
# TESTS_DIR variable set by the calling test-runner script.

TEST_41_1_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_41_1_test.sql | xargs)
if [[ $TEST_41_1_RESULT -eq 1 ]]; then
    echo "Test 41.1 passed: New column for LoA revision is added correctly"
else
    echo "******** Test 41.1 failed: Failed to add new column for LoA revision"
fi

TEST_41_2_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_41_2_test.sql | xargs)
if [[ $TEST_41_2_RESULT -eq 1 ]]; then
    echo "Test 41.2 passed: Db column constraint for LoA revision is added correctly"
else
    echo "******** Test 41.2 failed: Failed to add constraint for LoA revision"
fi