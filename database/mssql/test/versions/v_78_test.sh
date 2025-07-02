#!/bin/bash

# Retrieve arguments
source ${SCRIPT_DIR}/utility/getopt.sh
USAGE="-u USER -p PASS -s SERVER -d DATABASE"
parse_options "${USAGE}" ${@}

# All database tests for database version 78 are run from this shell script.
# TESTS_DIR variable set by the calling test-runner script.

TEST_78_1_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_78_1_test.sql | xargs)
if [[ $TEST_78_1_RESULT -eq 8 ]]; then
    echo "Test 78.1 passed: CASE_OPENED_DATE_TIME column added to ORBC_CASE table correctly"
else
    echo "******** Test 78.1 failed: CASE_OPENED_DATE_TIME column not added to ORBC_CASE table"
    echo $TEST_78_1_RESULT
fi