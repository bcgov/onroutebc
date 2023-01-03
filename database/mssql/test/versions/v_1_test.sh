#!/bin/bash

# All database tests for database version 2 are run from this shell script.

TESTS_DIR=/usr/config/test/versions

# Test 1.1 - verify the version table exists
TEST_1_1_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U $MSSQL_SA_USER -P $MSSQL_SA_PASSWORD -v MSSQL_DB=${1} -h -1 -i ${TESTS_DIR}/v_1_1_test.sql)

if [[ $TEST_1_1_RESULT -eq 1 ]]; then
    echo "Test 1.1 passed: ORBC_SYS_VERSION table exists"
else
    echo "******** Test 1.1 failed: ORBC_SYS_VERSION table does not exist"
fi