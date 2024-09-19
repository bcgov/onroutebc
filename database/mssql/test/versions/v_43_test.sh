#!/bin/bash

# Retrieve arguments
source ${SCRIPT_DIR}/utility/getopt.sh
USAGE="-u USER -p PASS -s SERVER -d DATABASE"
parse_options "${USAGE}" ${@}

# All database tests for database version 43 are run from this shell script.
# TESTS_DIR variable set by the calling test-runner script.

TEST_43_1_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_43_1_test.sql | xargs)
if [[ $TEST_43_1_RESULT -eq 1 ]]; then
    echo "Test 43.1 passed: New table for LoA assignment created successfully"
else
    echo "******** Test 43.1 failed: Failed to add new column for previous LoA id"
fi
