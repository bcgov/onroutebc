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

# Continue loop while the database is not yet fully initialized
# Database will be considered initialized once the sqlcmd returns a value of
# zero (0) which indicates that all system databases are in ready state.
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

# If the sqlcmd status is still non-zero or the sqlcmd is still returning an
# error code after 60 iterations, consider the sql-server-db container failed and exit.
if [ $DBSTATUS -ne 0 ] || [ $ERRCODE -ne 0 ]; then 
	echo "SQL Server took more than 60 seconds to start up or one or more databases are not in an ONLINE state"
	exit 1
fi

# Run the setup script to create the DB and the schema in the DB
echo "Executing $MSSQL_INIT_DDL_FILENAME ..."
/opt/mssql-tools/bin/sqlcmd -U $MSSQL_SA_USER -P $MSSQL_SA_PASSWORD -d master -i /usr/config/$MSSQL_INIT_DDL_FILENAME

# Retrieve the version of the ORBC database from the version history table.
# If the version history table does not exist (which will be the case for a
# containerized db) then a value of zero (0) will be returned.
ORBC_DB_VERSION=$(/opt/mssql-tools/bin/sqlcmd -U $MSSQL_SA_USER -P $MSSQL_SA_PASSWORD -h -1 -l 60 -i /usr/config/get-orbc-db-version.sql)

echo "ORBC DB Version: $ORBC_DB_VERSION"

# Look for new database version DDL files, and execute them in sequence when found.
# DDL file names match the following pattern: v_NN_ddl.sql where NN is the version the
# database will be brought up to after execution.
# Example: v_2_ddl.sql will migrate the database from version 1 to version 2.

# DDL files are kept in the database/mssql/scripts/versions/ directory, and are copied
# into the /usr/config/versions/ directory in the container when built.
echo "Running migration scripts ..."
((NEXTVER=ORBC_DB_VERSION+1))
echo "Initial migration file: /usr/config/versions/v_${NEXTVER}_ddl.sql"

while test -f "/usr/config/versions/v_${NEXTVER}_ddl.sql"; do
    echo "Executing /usr/config/versions/v_${NEXTVER}_ddl.sql"
    # The FILE_HASH is saved to the database as a verification that the DDL was not altered
    # from what is present in the git repository.
    FILE_HASH=($(sha1sum /usr/config/versions/v_${NEXTVER}_ddl.sql))
    /opt/mssql-tools/bin/sqlcmd -U $MSSQL_SA_USER -P $MSSQL_SA_PASSWORD -v VERSION_ID=${NEXTVER} FILE_HASH=${FILE_HASH} -i /usr/config/versions/v_${NEXTVER}_ddl.sql
    ((NEXTVER=NEXTVER+1))
    echo "Next migration file to check: /usr/config/versions/v_${NEXTVER}_ddl.sql"
done