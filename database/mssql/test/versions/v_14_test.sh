#!/bin/bash

# Retrieve arguments
source ${SCRIPT_DIR}/utility/getopt.sh
USAGE="-u USER -p PASS -s SERVER -d DATABASE"
parse_options "${USAGE}" ${@}

# All database tests for database version 14 are run from this shell script.
# TESTS_DIR variable set by the calling test-runner script.

# Test 14.1 - verify that the tps migration tables exist
TEST_14_1_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_14_1_test.sql)

if [[ $TEST_14_1_RESULT -eq 1 ]]; then
    echo "Test 14.1 passed: All feature flag tables exist"
else
    echo "******** Test 14.1 failed: Missing one or more feature flag tables"
fi

