#!/bin/bash
# Taken from https://github.com/microsoft/mssql-docker/blob/master/linux/preview/examples/mssql-customize/entrypoint.sh

# Trust SQL Server certificate globally and disable encryption for self-signed certificates
# export SQLCMDTRUSTSERVERCERTIFICATE=yes
# export SQLCMDENCRYPT=no

# Start the script to create and initialize the DB
/usr/config/configure-db.sh &

# Start SQL Server
/opt/mssql/bin/sqlservr