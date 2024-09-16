#!/bin/bash

# Retrieve arguments
source ${SCRIPT_DIR}/utility/getopt.sh
USAGE="-u USER -p PASS -s SERVER -d DATABASE"
parse_options "${USAGE}" ${@}

# All database tests for database version 22 are run from this shell script.
# TESTS_DIR variable set by the calling test-runner script.

TEST_22_1_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_22_1_test.sql | xargs)
if [[ $TEST_22_1_RESULT -eq 1 ]]; then
    echo "Test 22.1 passed: User auth groups inserted correctly"
else
    echo "******** Test 22.1 failed: User auth groups not inserted correctly"
fi

TEST_22_2_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_22_2_test.sql | xargs)
if [[ $TEST_22_2_RESULT -eq 22 ]]; then
    echo "Test 22.2 passed: Correct number of role mappings inserted"
else
    echo "******** Test 22.2 failed: Incorrect number of role mappings inserted: "
    echo $TEST_22_2_RESULT
fi
