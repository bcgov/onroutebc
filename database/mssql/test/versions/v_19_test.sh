#!/bin/bash

# Retrieve arguments
source ${SCRIPT_DIR}/utility/getopt.sh
USAGE="-u USER -p PASS -s SERVER -d DATABASE"
parse_options "${USAGE}" ${@}

# All database tests for database version 19 are run from this shell script.
# TESTS_DIR variable set by the calling test-runner script.

# Test 19.1 - verify that the ORBC_IDIR_USER table no longer exists
TEST_19_1_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_19_1_test.sql)

if [[ $TEST_19_1_RESULT -eq 1 ]]; then
    echo "Test 19.1 passed: ORBC_IDIR_USER table has been removed"
else
    echo "******** Test 19.1 failed: ORBC_IDIR_USER table has not been removed"
fi
