#!/bin/bash

# Retrieve arguments
source ${SCRIPT_DIR}/utility/getopt.sh
USAGE="-u USER -p PASS -s SERVER -d DATABASE"
parse_options "${USAGE}" ${@}

echo "Deleting existing sample data"
sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -d ${DATABASE} -Q "DELETE FROM dbo.ORBC_DOCUMENT"
sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -d ${DATABASE} -Q "DELETE FROM dbo.ORBC_PDF_TEMPLATE"
sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -d ${DATABASE} -Q "DELETE FROM dbo.ORBC_TRAILER"
sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -d ${DATABASE} -Q "DELETE FROM dbo.ORBC_POWER_UNIT"
sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -d ${DATABASE} -Q "DELETE FROM dbo.ORBC_COMPANY_USER"
sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -d ${DATABASE} -Q "DELETE FROM dbo.ORBC_USER"
sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -d ${DATABASE} -Q "DELETE FROM dbo.ORBC_COMPANY"
sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -d ${DATABASE} -Q "DELETE FROM dbo.ORBC_CONTACT"
sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -d ${DATABASE} -Q "DELETE FROM dbo.ORBC_ADDRESS"
echo "Finished deleting existing sample data"

echo "Loading sample data...please wait"
sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -d ${DATABASE} -i ${SCRIPT_DIR}/sampledata/dbo.ORBC_ADDRESS.Table.sql
sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -d ${DATABASE} -i ${SCRIPT_DIR}/sampledata/dbo.ORBC_CONTACT.Table.sql
sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -d ${DATABASE} -i ${SCRIPT_DIR}/sampledata/dbo.ORBC_COMPANY.Table.sql
sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -d ${DATABASE} -i ${SCRIPT_DIR}/sampledata/dbo.ORBC_USER.Table.sql
sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -d ${DATABASE} -i ${SCRIPT_DIR}/sampledata/dbo.ORBC_COMPANY_USER.Table.sql
sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -d ${DATABASE} -i ${SCRIPT_DIR}/sampledata/dbo.ORBC_POWER_UNIT.Table.sql
sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -d ${DATABASE} -i ${SCRIPT_DIR}/sampledata/dbo.ORBC_TRAILER.Table.sql
sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -d ${DATABASE} -i ${SCRIPT_DIR}/sampledata/dbo.ORBC_PDF_TEMPLATE.Table.sql
sqlcmd -U ${USER} -P "${PASS}" -S ${SERVER} -d ${DATABASE} -i ${SCRIPT_DIR}/sampledata/dbo.ORBC_DOCUMENT.Table.sql
echo "Finished loading sample data"
