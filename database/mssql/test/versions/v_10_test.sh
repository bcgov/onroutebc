#!/bin/bash

# Retrieve arguments
source ${SCRIPT_DIR}/utility/getopt.sh
USAGE="-u USER -p PASS -s SERVER -d DATABASE"
parse_options "${USAGE}" ${@}

# All database tests for database version 10 are run from this shell script.
# TESTS_DIR variable set by the calling test-runner script.

TEST_10_1_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_10_1_test.sql | xargs)
if [[ $TEST_10_1_RESULT == 'Mar. 12 2023 1:59:59 AM PST' ]]; then
    echo "Test 10.1 passed: Before DST start date formatted correctly"
else
    echo "******** Test 10.1 failed: Incorrect formatted date returned"
fi

TEST_10_2_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_10_2_test.sql | xargs)
if [[ $TEST_10_2_RESULT == 'Mar. 12 2023 3:00:00 AM PDT' ]]; then
    echo "Test 10.2 passed: After DST start date formatted correctly"
else
    echo "******** Test 10.2 failed: Incorrect formatted date returned"
fi

TEST_10_3_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_10_3_test.sql | xargs)
if [[ $TEST_10_3_RESULT == 'Feb. 29 2024 8:00:00 PM PST' ]]; then
    echo "Test 10.3 passed: Leap year date formatted correctly"
else
    echo "******** Test 10.3 failed: Incorrect formatted date returned"
fi

TEST_10_4_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_10_4_test.sql | xargs)
if [[ $TEST_10_4_RESULT == 'Dec. 31 2023 8:00:00 PM PST' ]]; then
    echo "Test 10.4 passed: Year crossover date formatted correctly"
else
    echo "******** Test 10.4 failed: Incorrect formatted date returned"
fi

TEST_10_5_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_10_5_test.sql | xargs)
if [[ $TEST_10_5_RESULT == 'Nov. 5 2023 1:30:00 AM PDT' ]]; then
    echo "Test 10.5 passed: Before DST end date formatted correctly"
else
    echo "******** Test 10.5 failed: Incorrect formatted date returned"
fi

TEST_10_6_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_10_6_test.sql | xargs)
if [[ $TEST_10_6_RESULT == 'Nov. 5 2023 1:30:00 AM PST' ]]; then
    echo "Test 10.6 passed: After DST end date formatted correctly"
else
    echo "******** Test 10.6 failed: Incorrect formatted date returned"
fi
