#!/bin/bash

# Retrieve arguments
source ${SCRIPT_DIR}/utility/getopt.sh
USAGE="-u USER -p PASS -s SERVER -d DATABASE"
parse_options "${USAGE}" ${@}

# All database tests for database version 2 are run from this shell script.
# TESTS_DIR variable set by the calling test-runner script.

# Test 2.1 - verify all initial manage vehicle tables exist
TEST_2_1_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_2_1_test.sql)

if [[ $TEST_2_1_RESULT -eq 1 ]]; then
    echo "Test 2.1 passed: All ORBC manage vehicle tables exist"
else
    echo "******** Test 2.1 failed: Missing one or more ORBC manage vehicle tables"
fi