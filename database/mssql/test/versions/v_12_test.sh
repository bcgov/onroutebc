#!/bin/bash

# Retrieve arguments
source ${SCRIPT_DIR}/utility/getopt.sh
USAGE="-u USER -p PASS -s SERVER -d DATABASE"
parse_options "${USAGE}" ${@}

# All database tests for database version 12 are run from this shell script.
# TESTS_DIR variable set by the calling test-runner script.

TEST_12_1_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_12_1_test.sql | xargs)
if [[ $TEST_12_1_RESULT -eq 1 ]]; then
    echo "Test 12.1 passed: Trigger is populating records into ORBC_PERMIT"
else
    echo "******** Test 12.1 failed: Trigger not populating records into ORBC_PERMIT"
fi

TEST_12_2_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_12_2_test.sql | xargs)
if [[ $TEST_12_2_RESULT -eq 1 ]]; then
    echo "Test 12.2 passed: Duplicate records not being inserted into ORBC_PERMIT"
else
    echo "******** Test 12.2 failed: Duplicate records being inserted into ORBC_PERMIT"
fi

TEST_12_3_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_12_3_test.sql | xargs)
if [[ $TEST_12_3_RESULT -eq 1 ]]; then
    echo "Test 12.3 passed: Permit number of amendments being adjusted correctly"
else
    echo "******** Test 12.3 failed: Permit number of amendments not being adjusted correctly"
fi

TEST_12_4_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -v DB_NAME=${DATABASE} -h -1 -i ${TESTS_DIR}/v_12_4_test.sql | xargs)
if [[ $TEST_12_4_RESULT -eq 1 ]]; then
    echo "Test 12.4 passed: Previous revisions correctly marked SUPERSEDED"
else
    echo "******** Test 12.4 failed: Previous revisions not being marked SUPERSEDED"
fi
