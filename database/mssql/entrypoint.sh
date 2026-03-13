#!/bin/bash
# Taken from https://github.com/microsoft/mssql-docker/blob/master/linux/preview/examples/mssql-customize/entrypoint.sh

# Trust SQL Server certificate globally and disable encryption for self-signed certificates
export SQLCMDTRUSTSERVERCERTIFICATE=yes
export SQLCMDENCRYPT=no

# Start the script to create and initialize the DB (in background)
/usr/config/configure-db.sh &

# Drop to mssql user to run SQL Server (gosu is like sudo but lighter weight)
exec gosu mssql /opt/mssql/bin/sqlservr