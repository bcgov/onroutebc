#!/bin/bash

# Retrieve arguments
source ${SCRIPT_DIR}/utility/getopt.sh
USAGE="-u ORBC_USER -p ORBC_PASS -s ORBC_SERVER -d ORBC_DATABASE"
parse_options "${USAGE}" ${@}

# Clear out all records from the pending IDIR users table
sqlcmd -C -U ${ORBC_USER} -P "${ORBC_PASS}" -S ${ORBC_SERVER} -d ${ORBC_DATABASE} -Q "SET NOCOUNT ON; UPDATE permit.ORBC_PERMIT_TYPE SET GL_CODE=NULL"

(
# PAYBC_GL_CODE environment variable must be a string representing an array
# of tuples in the format PERMIT_TUPE,GL_CODE separated by single space characters.
# For example "TROS,000.00000.00000.0000.0000000.000000.0000 TROW,EOF000.00000.00000.0000.0000000.000000.0000"
for i in ${PAYBC_GL_CODE}
do 
	IFS=","; set -- $i
	echo "Updating permit type ${1} with GL_CODE ${2}"
  sqlcmd -C -U ${ORBC_USER} -P "${ORBC_PASS}" -S ${ORBC_SERVER} -d ${ORBC_DATABASE} -v PERMIT_TYPE=${1} GL_CODE=${2} -i ${SCRIPT_DIR}/sampledata/permit.ORBC_PERMIT_TYPE.Table.sql
done
)
