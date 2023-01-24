#!/bin/bash

# All database tests for database version 3 are run from this shell script.

TESTS_DIR=/usr/config/test/versions

# Test 3.1 - verify all initial manage profile tables exist
TEST_3_1_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U $MSSQL_SA_USER -P $MSSQL_SA_PASSWORD -v MSSQL_DB=${1} -h -1 -i ${TESTS_DIR}/v_3_1_test.sql)

if [[ $TEST_3_1_RESULT -eq 1 ]]; then
    echo "Test 3.1 passed: All ORBC manage profile tables exist"
else
    echo "******** Test 3.1 failed: Missing one or more ORBC manage profile tables"
fi