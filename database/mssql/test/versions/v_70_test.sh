#!/bin/bash

# Retrieve arguments
source ${SCRIPT_DIR}/utility/getopt.sh
USAGE="-u USER -p PASS -s SERVER -d DATABASE"
parse_options "${USAGE}" ${@}

# All database tests for database version 70 are run from this shell script.
# TESTS_DIR variable set by the calling test-runner script.

TEST_70_1_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_70_1_test.sql | xargs)
if [[ $TEST_70_1_RESULT -eq 1 ]]; then
    echo "Test 70.1 passed: outage notification tables exist."
else
    echo "******** Test 70.1 failed: Missing outage notification table."
fi