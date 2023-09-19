#!/bin/bash

# Retrieve arguments
source ${SCRIPT_DIR}/utility/getopt.sh
USAGE="-u USER -p PASS -s SERVER -d DATABASE"
parse_options "${USAGE}" ${@}

echo "Deleting existing sample data"
sqlcmd -C -U ${USER} -P "${PASS}" -S ${SERVER} -d ${DATABASE} -Q "DELETE FROM dops.ORBC_EXTERNAL_DOCUMENT"
sqlcmd -C -U ${USER} -P "${PASS}" -S ${SERVER} -d ${DATABASE} -Q "DELETE FROM dops.ORBC_DOCUMENT"
sqlcmd -C -U ${USER} -P "${PASS}" -S ${SERVER} -d ${DATABASE} -Q "DELETE FROM dops.ORBC_DOCUMENT_TEMPLATE"
sqlcmd -C -U ${USER} -P "${PASS}" -S ${SERVER} -d ${DATABASE} -Q "DELETE FROM dbo.ORBC_TRAILER"
sqlcmd -C -U ${USER} -P "${PASS}" -S ${SERVER} -d ${DATABASE} -Q "DELETE FROM dbo.ORBC_POWER_UNIT"
sqlcmd -C -U ${USER} -P "${PASS}" -S ${SERVER} -d ${DATABASE} -Q "DELETE FROM dbo.ORBC_COMPANY_USER"
sqlcmd -C -U ${USER} -P "${PASS}" -S ${SERVER} -d ${DATABASE} -Q "DELETE FROM dbo.ORBC_USER"
sqlcmd -C -U ${USER} -P "${PASS}" -S ${SERVER} -d ${DATABASE} -Q "DELETE FROM dbo.ORBC_COMPANY"
sqlcmd -C -U ${USER} -P "${PASS}" -S ${SERVER} -d ${DATABASE} -Q "DELETE FROM dbo.ORBC_CONTACT"
sqlcmd -C -U ${USER} -P "${PASS}" -S ${SERVER} -d ${DATABASE} -Q "DELETE FROM dbo.ORBC_ADDRESS"
echo "Finished deleting existing sample data"

echo "Loading sample data...please wait"
sqlcmd -C -U ${USER} -P "${PASS}" -S ${SERVER} -d ${DATABASE} -i ${SCRIPT_DIR}/sampledata/dbo.ORBC_ADDRESS.Table.sql
sqlcmd -C -U ${USER} -P "${PASS}" -S ${SERVER} -d ${DATABASE} -i ${SCRIPT_DIR}/sampledata/dbo.ORBC_CONTACT.Table.sql
sqlcmd -C -U ${USER} -P "${PASS}" -S ${SERVER} -d ${DATABASE} -i ${SCRIPT_DIR}/sampledata/dbo.ORBC_COMPANY.Table.sql
sqlcmd -C -U ${USER} -P "${PASS}" -S ${SERVER} -d ${DATABASE} -i ${SCRIPT_DIR}/sampledata/dbo.ORBC_USER.Table.sql
sqlcmd -C -U ${USER} -P "${PASS}" -S ${SERVER} -d ${DATABASE} -i ${SCRIPT_DIR}/sampledata/dbo.ORBC_COMPANY_USER.Table.sql
sqlcmd -C -U ${USER} -P "${PASS}" -S ${SERVER} -d ${DATABASE} -i ${SCRIPT_DIR}/sampledata/dbo.ORBC_POWER_UNIT.Table.sql
sqlcmd -C -U ${USER} -P "${PASS}" -S ${SERVER} -d ${DATABASE} -i ${SCRIPT_DIR}/sampledata/dbo.ORBC_TRAILER.Table.sql
sqlcmd -C -U ${USER} -P "${PASS}" -S ${SERVER} -d ${DATABASE} -i ${SCRIPT_DIR}/sampledata/dops.ORBC_DOCUMENT_TEMPLATE.Table.sql
sqlcmd -C -U ${USER} -P "${PASS}" -S ${SERVER} -d ${DATABASE} -i ${SCRIPT_DIR}/sampledata/dops.ORBC_DOCUMENT.Table.sql
sqlcmd -C -U ${USER} -P "${PASS}" -S ${SERVER} -d ${DATABASE} -i ${SCRIPT_DIR}/sampledata/dops.ORBC_EXTERNAL_DOCUMENT.Table.sql

${SCRIPT_DIR}/utility/refresh-sample-idir-users.sh -u ${USER} -p "${PASS}" -s ${SERVER} -d ${DATABASE}

echo "Finished loading sample data"
