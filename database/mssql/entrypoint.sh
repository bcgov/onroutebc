#!/bin/bash
# Taken from https://github.com/microsoft/mssql-docker/blob/master/linux/preview/examples/mssql-customize/entrypoint.sh

# Ensure /var/opt/mssql has correct permissions for SQL Server to write to it
# (directory permissions may be lost on Docker Desktop due to mounted volumes)
# mkdir -p /var/opt/mssql/.system
# mkdir -p /var/opt/mssql/backup
# mkdir -p /var/opt/mssql/data
# mkdir -p /var/opt/mssql/log
# chown -R mssql:mssql /var/opt/mssql
# chmod -R 755 /var/opt/mssql

# Trust SQL Server certificate globally and disable encryption for self-signed certificates
export SQLCMDTRUSTSERVERCERTIFICATE=yes
export SQLCMDENCRYPT=no

# Start the script to create and initialize the DB (in background)
/usr/config/configure-db.sh &

# Drop to mssql user to run SQL Server (gosu is like sudo but lighter weight)
exec gosu mssql /opt/mssql/bin/sqlservr