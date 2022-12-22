#!/bin/bash

# Wait 60 seconds for SQL Server to start up by ensuring that 
# calling SQLCMD does not return an error code, which will ensure that sqlcmd is accessible
# and that system and user databases return "0" which means all databases are in an "online" state
# https://docs.microsoft.com/en-us/sql/relational-databases/system-catalog-views/sys-databases-transact-sql?view=sql-server-2017 

# Taken largely from https://github.com/microsoft/mssql-docker/blob/master/linux/preview/examples/mssql-customize/configure-db.sh

echo "Executing configure-db.sh ..."

DBSTATUS=1
ERRCODE=1
i=0

while ([ $DBSTATUS -ne 0 ] || [ $ERRCODE -ne 0 ]) && [ $i -lt 60 ]; do
    echo "Checking db status..."
	((i=i+1))
	DBSTATUS=$(/opt/mssql-tools/bin/sqlcmd -h -1 -t 1 -U $MSSQL_SA_USER -P $MSSQL_SA_PASSWORD -Q "SET NOCOUNT ON; Select SUM(state) from sys.databases")
	ERRCODE=$?
	sleep 1
    echo "DBSTATUS: $DBSTATUS"
    echo "ERRCODE: $ERRCODE"
    echo "i: $i"
done

if [ $DBSTATUS -ne 0 ] || [ $ERRCODE -ne 0 ]; then 
	echo "SQL Server took more than 60 seconds to start up or one or more databases are not in an ONLINE state"
	exit 1
fi

# Run the setup script to create the DB and the schema in the DB
echo "Executing $MSSQL_INIT_DDL_FILENAME ..."
/opt/mssql-tools/bin/sqlcmd -U $MSSQL_SA_USER -P $MSSQL_SA_PASSWORD -d master -i /usr/config/$MSSQL_INIT_DDL_FILENAME

ORBC_DB_VERSION=$(/opt/mssql-tools/bin/sqlcmd -U $MSSQL_SA_USER -P $MSSQL_SA_PASSWORD -h -1 -l 60 -i /usr/config/get-orbc-db-version.sql)

echo "ORBC DB Version: $ORBC_DB_VERSION"

echo "Running migration scripts ..."
((NEXTVER=ORBC_DB_VERSION+1))

echo "Initial migration file: /usr/config/versions/v_${NEXTVER}_ddl.sql"

while test -f "/usr/config/versions/v_${NEXTVER}_ddl.sql"; do
    echo "Executing /usr/config/versions/v_${NEXTVER}_ddl.sql"
    FILE_HASH=($(sha1sum /usr/config/versions/v_${NEXTVER}_ddl.sql))
    echo "SHA-1 hash of script file: ${FILE_HASH}"
    /opt/mssql-tools/bin/sqlcmd -U $MSSQL_SA_USER -P $MSSQL_SA_PASSWORD -v VERSION_ID=${NEXTVER} FILE_HASH=${FILE_HASH} -i /usr/config/versions/v_${NEXTVER}_ddl.sql
    ((NEXTVER=NEXTVER+1))
    echo "Next migration file to check: /usr/config/versions/v_${NEXTVER}_ddl.sql"
done