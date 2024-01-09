#!/bin/bash

# Retrieve arguments
source ${SCRIPT_DIR}/utility/getopt.sh
USAGE="-u USER -p PASS -s SERVER -d DATABASE"
parse_options "${USAGE}" ${@}

# All database tests for database version 11 are run from this shell script.
# TESTS_DIR variable set by the calling test-runner script.

echo '*** This v11 script is a stub, no tests yet created for v11.'