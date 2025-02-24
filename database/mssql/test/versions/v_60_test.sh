#!/bin/bash

# Retrieve arguments
source ${SCRIPT_DIR}/utility/getopt.sh
USAGE="-u USER -p PASS -s SERVER -d DATABASE"
parse_options "${USAGE}" ${@}

# All database tests for database version 60 are run from this shell script.
# TESTS_DIR variable set by the calling test-runner script.

TEST_60_1_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_60_1_test.sql | xargs)
if [[ $TEST_60_1_RESULT -eq 1 ]]; then
    echo "Test 60.1 passed: APV96 form configured correctly"
else
    echo "******** Test 60.1 failed: APV96 form configuration failure"
fi