#!/bin/bash

# Retrieve arguments
source ${SCRIPT_DIR}/utility/getopt.sh
USAGE="-u USER -p PASS -s SERVER -d DATABASE"
parse_options "${USAGE}" ${@}

# All database tests for database version 28 are run from this shell script.
# TESTS_DIR variable set by the calling test-runner script.

TEST_28_1_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_28_1_test.sql | xargs)
if [[ $TEST_28_1_RESULT -eq 2 ]]; then
    echo "Test 28.1 passed: Role types inserted correctly"
else
    echo "******** Test 28.1 failed: Role types not inserted correctly"
fi

TEST_28_2_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_28_2_test.sql | xargs)
if [[ $TEST_28_2_RESULT -eq 4 ]]; then
    echo "Test 28.2 passed: Correct number of role mappings inserted"
else
    echo "******** Test 28.2 failed: Incorrect number of role mappings inserted"
fi

TEST_28_3_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_28_3_test.sql | xargs)
if [[ $TEST_28_3_RESULT -eq 1 ]]; then
    echo "Test 28.3 passed: Tables were created successfully"
else
    echo "******** Test 28.3 failed: Table creation failed"
fi

TEST_28_4_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_28_4_test.sql | xargs)
if [[ $TEST_28_4_RESULT -eq 5 ]]; then
    echo "Test 28.4 passed: Correct number of credit account activity types inserted"
else
    echo "******** Test 28.4 failed: Incorrect number of credit account activity types inserted"
fi

TEST_28_5_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_28_5_test.sql | xargs)
if [[ $TEST_28_5_RESULT -eq 4 ]]; then
    echo "Test 28.5 passed: Correct number of credit account status types inserted"
else
    echo "******** Test 28.5 failed: Incorrect number of credit account status types inserted"
fi

TEST_28_6_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_28_6_test.sql | xargs)
if [[ $TEST_28_6_RESULT -eq 3 ]]; then
    echo "Test 28.6 passed: Correct number of credit account types inserted"
else
    echo "******** Test 28.6 failed: Incorrect number of credit account types inserted"
fi