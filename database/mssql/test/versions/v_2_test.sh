#!/bin/bash

# All database tests for database version 2 are run from this shell script.

TESTS_DIR=/usr/config/test/versions

# Test 2.1 - verify all initial manage vehicle tables exist
TEST_2_1_RESULT=$(/opt/mssql-tools/bin/sqlcmd -U $MSSQL_SA_USER -P $MSSQL_SA_PASSWORD -v MSSQL_DB=${1} -h -1 -i ${TESTS_DIR}/v_2_1_test.sql)

if [[ $TEST_2_1_RESULT -eq 1 ]]; then
    echo "Test 2.1 passed: All ORBC manage vehicle tables exist"
else
    echo "******** Test 2.1 failed: Missing one or more ORBC manage vehicle tables"
fi