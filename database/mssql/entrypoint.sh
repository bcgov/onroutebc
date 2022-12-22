#!/bin/bash
# Taken from https://github.com/microsoft/mssql-docker/blob/master/linux/preview/examples/mssql-customize/entrypoint.sh

# Start the script to create the DB and user
/usr/config/configure-db.sh &

# Start SQL Server
/opt/mssql/bin/sqlservr