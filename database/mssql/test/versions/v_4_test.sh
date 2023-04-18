#!/bin/bash

# Retrieve arguments
source ${SCRIPT_DIR}/utility/getopt.sh
USAGE="-u USER -p PASS -s SERVER -d DATABASE"
parse_options "${USAGE}" ${@}

# All database tests for database version 4 are run from this shell script.
# TESTS_DIR variable set by the calling test-runner script.

# Test 4.1 - verify all initial permit tables exist
TEST_4_1_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_4_1_test.sql)

if [[ $TEST_4_1_RESULT -eq 1 ]]; then
    echo "Test 4.1 passed: All ORBC permit tables exist"
else
    echo "******** Test 4.1 failed: Missing one or more ORBC permit tables"
fi

# Test 4.2 - verify the application number is correctly generated
TEST_4_2_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_4_2_test.sql)

if [[ $TEST_4_2_RESULT =~ A2-00000001-[0-9][0-9][0-9] ]]; then
    echo "Test 4.2 passed: Application number is generated correctly"
else
    echo "******** Test 4.2 failed: Application number is not generated correctly"
    echo "******** Receivedeceived ${TEST_4_2_RESULT}"
fi

# Test 4.3 - verify the permit status is correctly initialized
TEST_4_3_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_4_3_test.sql)

if [[ $TEST_4_3_RESULT =~ IN_PROGRESS ]]; then
    echo "Test 4.3 passed: Permit status is initialized correctly"
else
    echo "******** Test 4.3 failed: Permit status is not initialized correctly"
    echo "******** Receivedeceived ${TEST_4_3_RESULT}"
fi

# Test 4.4 - verify the permit number is correctly generated
TEST_4_4_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_4_4_test.sql)

if [[ $TEST_4_4_RESULT =~ P1-00000035-[0-9][0-9][0-9] ]]; then
    echo "Test 4.4 passed: Permit number is generated correctly"
else
    echo "******** Test 4.4 failed: Permit number is not generated correctly"
    echo "******** Received ${TEST_4_4_RESULT}"
fi

# Test 4.5 - verify the application number is correctly generated with revision
TEST_4_5_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_4_5_test.sql)

if [[ $TEST_4_5_RESULT =~ A2-00000035-[0-9][0-9][0-9]-R01 ]]; then
    echo "Test 4.5 passed: Application number with revision is generated correctly"
else
    echo "******** Test 4.5 failed: Application number with revision is not generated correctly"
    echo "******** Received ${TEST_4_5_RESULT}"
fi

# Test 4.6 - verify the permit number is correctly generated with revision
TEST_4_6_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_4_6_test.sql)

if [[ $TEST_4_6_RESULT =~ P1-00000035-123-R01 ]]; then
    echo "Test 4.6 passed: Permit number with revision is generated correctly"
else
    echo "******** Test 4.6 failed: Permit number with revision is not generated correctly"
    echo "******** Received ${TEST_4_6_RESULT}"
fi