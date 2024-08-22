#!/bin/bash

# Retrieve arguments
source ${SCRIPT_DIR}/utility/getopt.sh
USAGE="-u USER -p PASS -s SERVER -d DATABASE"
parse_options "${USAGE}" ${@}

# All database tests for database version 39 are run from this shell script.
# TESTS_DIR variable set by the calling test-runner script.

TEST_39_1_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_39_1_test.sql | xargs)
if [[ $TEST_39_1_RESULT -eq 1 ]]; then
    echo "Test 39.1 passed: Db column constaints for special auth and no fee table are added correctly"
else
    echo "******** Test 39.1 failed: Db column constaints for special auth and no fee table are not added correctly"
fi