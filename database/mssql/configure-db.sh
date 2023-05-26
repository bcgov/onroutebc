#!/bin/bash

# Wait 60 seconds for SQL Server to start up by ensuring that 
# calling SQLCMD does not return an error code, which will ensure that sqlcmd is accessible
# and that system and user databases return "0" which means all databases are in an "online" state
# https://docs.microsoft.com/en-us/sql/relational-databases/system-catalog-views/sys-databases-transact-sql?view=sql-server-2017 

# Taken largely from https://github.com/microsoft/mssql-docker/blob/master/linux/preview/examples/mssql-customize/configure-db.sh

echo "Executing configure-db.sh ..."

export PATH="/opt/mssql-tools/bin:$PATH"

DBSTATUS=1
ERRCODE=1
i=0

while ([[ ${DBSTATUS} -ne 0 ]] || [[ ${ERRCODE} -ne 0 ]]) && [[ ${i} -lt 60 ]]; do
    echo "Checking db status..."
	((i=i+1))
	DBSTATUS=$(/opt/mssql-tools/bin/sqlcmd -h -1 -t 1 -U ${MSSQL_SA_USER} -P ${MSSQL_SA_PASSWORD} -S ${MSSQL_HOST} -Q "SET NOCOUNT ON; Select SUM(state) from sys.databases")
	ERRCODE=$?
	sleep 1
    echo "DBSTATUS: ${DBSTATUS}"
    echo "ERRCODE: ${ERRCODE}"
    echo "i: ${i}"
done

# If the sqlcmd status is still non-zero or the sqlcmd is still returning an
# error code after 60 iterations, consider the sql-server-db container failed and exit.
if [[ ${DBSTATUS} -ne 0 ]] || [[ ${ERRCODE} -ne 0 ]]; then 
	echo "SQL Server took more than 60 seconds to start up or one or more databases are not in an ONLINE state"
	exit 1
fi

# Run database unit tests if configured to do so
if [[ ${MSSQL_RUN_TESTS} -eq 1 ]]; then
    /usr/config/test/test-runner.sh
fi

# Run the setup script to create the DB
echo "Creating ORBC database..."
/opt/mssql-tools/bin/sqlcmd -U ${MSSQL_SA_USER} -P "${MSSQL_SA_PASSWORD}" -S ${MSSQL_HOST} -d master -Q "CREATE DATABASE ${MSSQL_DB}"

# Load current schema into the database from all DDL version scripts
/usr/config/utility/migrate-db-current.sh -u ${MSSQL_SA_USER} -p "${MSSQL_SA_PASSWORD}" -s ${MSSQL_HOST} -d ${MSSQL_DB}

# Load sample data if configured
if [[ $MSSQL_LOAD_SAMPLE_DATA -eq 1 ]]; then
    /usr/config/utility/refresh-sample-data.sh -u ${MSSQL_SA_USER} -p "${MSSQL_SA_PASSWORD}" -s ${MSSQL_HOST} -d ${MSSQL_DB} 
fi
