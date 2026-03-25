#!/bin/bash

# Wait 60 seconds for SQL Server to start up by ensuring that 
# calling SQLCMD does not return an error code, which will ensure that sqlcmd is accessible
# and that system and user databases return "0" which means all databases are in an "online" state
# https://docs.microsoft.com/en-us/sql/relational-databases/system-catalog-views/sys-databases-transact-sql?view=sql-server-2017 

# Taken largely from https://github.com/microsoft/mssql-docker/blob/master/linux/preview/examples/mssql-customize/configure-db.sh

echo "Executing configure-db.sh ..."

source ${SCRIPT_DIR}/utility/orbc-db-functions.sh

export PATH="/opt/mssql-tools18/bin:$PATH"

DBSTATUS=1
ERRCODE=1
i=0

while ([[ ${DBSTATUS} -ne 0 ]] || [[ ${ERRCODE} -ne 0 ]]) && [[ ${i} -lt 60 ]]; do
  echo "Checking db status..."
  ((i=i+1))
  DBSTATUS=$(/opt/mssql-tools18/bin/sqlcmd -C -h -1 -t 1 -U ${MSSQL_SA_USER} -P ${MSSQL_SA_PASSWORD} -S ${MSSQL_HOST} -Q "SET NOCOUNT ON; Select SUM(state) from sys.databases")
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

# Run the setup script to create the DB (only if it doesn't already exist)
DB_EXISTS=$(/opt/mssql-tools18/bin/sqlcmd -C -h -1 -W -t 1 -U ${MSSQL_SA_USER} -P "${MSSQL_SA_PASSWORD}" -S ${MSSQL_HOST} -d master -Q "SET NOCOUNT ON; SELECT COUNT(*) FROM sys.databases WHERE name = '${MSSQL_DB}'")
DB_EXISTS="${DB_EXISTS//[[:space:]]/}"

if [[ "${DB_EXISTS}" -eq 0 ]]; then
  echo "Creating ORBC database..."
  /opt/mssql-tools18/bin/sqlcmd -C -U ${MSSQL_SA_USER} -P "${MSSQL_SA_PASSWORD}" -S ${MSSQL_HOST} -d master -Q "CREATE DATABASE ${MSSQL_DB}"

  # Set compatibility level to 140 to match current moti DB (14.0.3485.1). Remove or adjust when upgrading.
  /opt/mssql-tools18/bin/sqlcmd -C -U ${MSSQL_SA_USER} -P "${MSSQL_SA_PASSWORD}" -S ${MSSQL_HOST} -d master -Q "ALTER DATABASE ${MSSQL_DB} SET COMPATIBILITY_LEVEL = 140"

  NEW_DB=1
else
  echo "Database ${MSSQL_DB} already exists, skipping creation."
  NEW_DB=0
fi

# Wait for the ORBC database to be ONLINE before running migrations
DB_ONLINE=1
wait_i=0
while [[ ${DB_ONLINE} -ne 0 ]] && [[ ${wait_i} -lt 60 ]]; do
  DB_ONLINE=$(/opt/mssql-tools18/bin/sqlcmd -C -h -1 -W -t 1 -U ${MSSQL_SA_USER} -P "${MSSQL_SA_PASSWORD}" -S ${MSSQL_HOST} -d master -Q "SET NOCOUNT ON; SELECT CASE WHEN state = 0 THEN 0 ELSE 1 END FROM sys.databases WHERE name = '${MSSQL_DB}'")
  DB_ONLINE="${DB_ONLINE//[[:space:]]/}"
  if [[ -z "${DB_ONLINE}" ]]; then
    DB_ONLINE=1
  fi
  ((wait_i=wait_i+1))
  sleep 1
done

if [[ ${DB_ONLINE} -ne 0 ]]; then
  echo "Database ${MSSQL_DB} did not become ONLINE in time. Exiting."
  exit 1
fi

# Load current schema into the database from all DDL version scripts
migrate_db_current ${MSSQL_SA_USER} "${MSSQL_SA_PASSWORD}" "${MSSQL_HOST}" ${MSSQL_DB}

# Load sample data if configured and if we just created the database
if [[ ${MSSQL_LOAD_SAMPLE_DATA} -eq 1 && ${NEW_DB} -eq 1 ]]; then
  /usr/config/utility/refresh-sample-data.sh -u ${MSSQL_SA_USER} -p '"${MSSQL_SA_PASSWORD}"' -s ${MSSQL_HOST} -d ${MSSQL_DB} 
  /usr/config/utility/refresh-sample-idir-users.sh -u ${MSSQL_SA_USER} -p '"${MSSQL_SA_PASSWORD}"' -s ${MSSQL_HOST} -d ${MSSQL_DB} 
  /usr/config/utility/refresh-paybc-gl-code.sh -u ${MSSQL_SA_USER} -p '"${MSSQL_SA_PASSWORD}"' -s ${MSSQL_HOST} -d ${MSSQL_DB} 
fi
