#!/bin/bash

# Retrieve arguments
source ${SCRIPT_DIR}/utility/getopt.sh
USAGE="-u USER -p PASS -s SERVER -d DATABASE"
parse_options "${USAGE}" ${@}

# All database tests for database version 3 are run from this shell script.
# TESTS_DIR variable set by the calling test-runner script.

# Test 3.1 - verify all initial manage profile tables exist
TEST_3_1_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_3_1_test.sql)

if [[ $TEST_3_1_RESULT -eq 1 ]]; then
    echo "Test 3.1 passed: All ORBC manage profile tables exist"
else
    echo "******** Test 3.1 failed: Missing one or more ORBC manage profile tables"
fi

# Test 3.2 - verify the correct number of returned roles for test user
TEST_3_2_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_3_2_test.sql)

if [[ $TEST_3_2_RESULT -eq 0 ]]; then
    echo "Test 3.2 passed: Function can be called with company context"
else
    echo "******** Test 3.2 failed: Error calling function with company context"
fi

# Test 3.3 - verify the correct number of returned roles for test user with no company context
TEST_3_3_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_3_3_test.sql)

if [[ $TEST_3_3_RESULT -eq 0 ]]; then
    echo "Test 3.3 passed: Function can be called with default company context"
else
    echo "******** Test 3.3 failed: Error calling function with default company context"
fi

# Test 3.4 - verify correct client number generation routine
TEST_3_4_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_3_4_test.sql)

# sqlcmd adds blank spaces to the end of the result, so we account for that in the regex
if [[ $TEST_3_4_RESULT =~ ^C4-123456-[0-9]{3}[[:space:]]*$ ]]; then
    echo "Test 3.4 passed: Correct client number generation"
else
    echo "******** Test 3.4 failed: Incorrect client number generation"
fi