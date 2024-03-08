#!/bin/bash

# Retrieve arguments
source ${SCRIPT_DIR}/utility/getopt.sh
USAGE="-u USER -p PASS -s SERVER -d DATABASE"
parse_options "${USAGE}" ${@}

# All database tests for database version 25 are run from this shell script.
# TESTS_DIR variable set by the calling test-runner script.

# Test 25.1 - verify that the feature key SHOPPING_CART exists
TEST_25_1_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_25_1_test.sql)

if [[ $TEST_25_1_RESULT -eq 1 ]]; then
    echo "Test 25.1 passed: ORBC_FEATURE_FLAG has the SHOPPING_CART key"
else
    echo "******** Test 25.1 failed: ORBC_FEATURE_FLAG does not have the SHOPPING_CART key"
fi
