#!/bin/bash

# Retrieve arguments
source ${SCRIPT_DIR}/utility/getopt.sh
USAGE="-u USER -p PASS -s SERVER -d DATABASE"
parse_options "${USAGE}" ${@}

# All database tests for database version 40 are run from this shell script.
# TESTS_DIR variable set by the calling test-runner script.

TEST_40_1_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_40_1_test.sql | xargs)
if [[ $TEST_40_1_RESULT -eq 1 ]]; then
    echo "Test 40.1 passed: No fee type updated successfully to MUNICIPALITY"
else
    echo "******** Test 40.1 failed: No fee type update to MUNICIPALITY failed"
fi

TEST_40_2_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_40_2_test.sql | xargs)
if [[ $TEST_40_2_RESULT -eq 1 ]]; then
    echo "Test 40.2 passed: No fee type updated successfully to USA_FEDERAL_GOVT"
else
    echo "******** Test 40.2 failed: No fee type updated to USA_FEDERAL_GOVT failed"
fi

TEST_40_3_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_40_3_test.sql | xargs)
if [[ $TEST_40_3_RESULT -eq 1 ]]; then
    echo "Test 40.3 passed: No fee type updated successfully to OTHER_USA_GOVT"
else
    echo "******** Test 40.3 failed: No fee type update to OTHER_USA_GOVT failed"
fi

TEST_40_4_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_40_4_test.sql | xargs)
if [[ "$TEST_40_4_RESULT" != "NULL" ]]; then
    echo "Test 40.4 passed: added foreign key constraints to No fee type table"
else
    echo "******** Test 40.4 failed: Could not add foreign constraints to No fee type table"
fi

TEST_40_5_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_40_5_test.sql | xargs)
if [[ "$TEST_40_5_RESULT" != "NULL"  ]]; then
    echo "Test 40.5 passed: added primary key constraints to No fee type table"
else
    echo "******** Test 40.5 failed: Could not add primary key constraints to No fee type table"
fi