#!/bin/bash

# Retrieve arguments
source ${SCRIPT_DIR}/utility/getopt.sh
USAGE="-u USER -p PASS -s SERVER -d DATABASE"
parse_options "${USAGE}" ${@}

# All database tests for database version 32 are run from this shell script.
# TESTS_DIR variable set by the calling test-runner script.

TEST_32_1_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_32_1_test.sql | xargs)
# Returns 60 for an nvarchar(30) data type due to larger nvarchar storage
if [[ $TEST_32_1_RESULT -eq 60 ]]; then
    echo "Test 32.1 passed: APP_LAST_UPDATE_USERID column created in ORBC_POLICY_CONFIGURATION"
else
    echo "******** Test 32.1 failed: APP_LAST_UPDATE_USERID column missing in ORBC_POLICY_CONFIGURATION"
fi

TEST_32_2_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_32_2_test.sql | xargs)
if [[ $TEST_32_2_RESULT -eq 2 ]]; then
    echo "Test 32.2 passed: Role types inserted correctly"
else
    echo "******** Test 32.2 failed: Role types not inserted correctly"
fi

TEST_32_3_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_32_3_test.sql | xargs)
if [[ $TEST_32_3_RESULT -eq 2 ]]; then
    echo "Test 32.3 passed: Correct number of role mappings inserted"
else
    echo "******** Test 32.3 failed: Incorrect number of role mappings inserted"
fi