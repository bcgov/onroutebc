#!/bin/bash

# Retrieve arguments
source ${SCRIPT_DIR}/utility/getopt.sh
USAGE="-u USER -p PASS -s SERVER -d DATABASE"
parse_options "${USAGE}" ${@}

# All database tests for database version 33 are run from this shell script.
# TESTS_DIR variable set by the calling test-runner script.

TEST_33_1_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_33_1_test.sql | xargs)
if [[ $TEST_33_1_RESULT -eq 3 ]]; then
    echo "Test 33.1 passed: Role types inserted correctly"
else
    echo "******** Test 33.1 failed: Role types not inserted correctly"
fi