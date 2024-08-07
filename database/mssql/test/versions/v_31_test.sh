#!/bin/bash

# Retrieve arguments
source ${SCRIPT_DIR}/utility/getopt.sh
USAGE="-u USER -p PASS -s SERVER -d DATABASE"
parse_options "${USAGE}" ${@}

# All database tests for database version 31 are run from this shell script.
# TESTS_DIR variable set by the calling test-runner script.

TEST_31_1_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_31_1_test.sql | xargs)
if [[ $TEST_31_1_RESULT -eq 40 ]]; then
    echo "Test 31.1 passed: GL_CODE column created in ORBC_PERMIT_TYPE"
else
    echo "******** Test 31.1 failed: GL_CODE column missing in ORBC_PERMIT_TYPE"
fi