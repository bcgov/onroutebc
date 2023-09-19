#!/bin/bash

# Retrieve arguments
source ${SCRIPT_DIR}/utility/getopt.sh
USAGE="-u USER -p PASS -s SERVER -d DATABASE"
parse_options "${USAGE}" ${@}

# Clear out all records from the pending IDIR users table
sqlcmd -C -U ${USER} -P "${PASS}" -S ${SERVER} -d ${DATABASE} -Q "SET NOCOUNT ON; DELETE FROM dbo.ORBC_PENDING_IDIR_USER"

(
# SAMPLE_PENDING_IDIR_USERS environment variable must be a string representing an array
# of tuples in the format IDIR_USERNAME,AUTH_GROUP separated by single space characters.
# For example "USER1,SYSADMIN USER2,EOFFICER"
for i in ${SAMPLE_PENDING_IDIR_USERS}
do 
	IFS=","; set -- $i
	echo "Adding pending IDIR user ${1} to auth group ${2}"
  sqlcmd -C -U ${USER} -P "${PASS}" -S ${SERVER} -d ${DATABASE} -v IDIR_USERNAME=${1} AUTH_GROUP=${2} -i ${SCRIPT_DIR}/sampledata/dbo.ORBC_PENDING_IDIR_USER.Table.sql
done
)
