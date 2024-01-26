#!/bin/bash

# Retrieve arguments
source ${SCRIPT_DIR}/utility/getopt.sh
USAGE="-u USER -p PASS -s SERVER -d DATABASE"
parse_options "${USAGE}" ${@}

# All database tests for database version 13 are run from this shell script.
# TESTS_DIR variable set by the calling test-runner script.

TEST_13_1_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_13_1_test.sql | xargs)
if [[ $TEST_13_1_RESULT -eq 2 ]]; then
    echo "Test 13.1 passed: User auth groups inserted correctly"
else
    echo "******** Test 13.1 failed: User auth groups not inserted correctly"
fi

TEST_13_2_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_13_2_test.sql | xargs)
if [[ $TEST_13_2_RESULT -eq 7 ]]; then
    echo "Test 13.2 passed: User auth roles inserted correctly"
else
    echo "******** Test 13.2 failed: User auth roles not inserted correctly"
fi

TEST_13_3_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_13_3_test.sql | xargs)
if [[ $TEST_13_3_RESULT -eq 25 ]]; then
    echo "Test 13.3 passed: Correct number of role mappings inserted"
else
    echo "******** Test 13.3 failed: Incorrect number of role mappings inserted"
fi
