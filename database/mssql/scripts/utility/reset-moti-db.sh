#!/bin/bash

# Resets the database schema in the MOTI hosted database from the schema
# DDL files in the versions/ directory. This involves reverting the schema
# using the revert sql files to get to a clean (empty) database state, then
# running the version schema files in sequence just like is done when the
# docker sql server container starts up with local development.

# Once the database has been refreshed, loads in the sample data.

# This script should only be done in a non-production database because it will
# wipe any data that currently exists (all tables will be dropped first).

# This is intended to be run from the local docker sql-server-db container, or
# a similar linux environment with the requisite env variables and sqlcmd
# installed in /opt/mssql-tools/bin/. Note you must be connected to the BC Gov
# Citrix VPN in order for the connection to be established.

/usr/config/utility/revert-moti-db-complete.sh
/usr/config/utility/migrate-moti-db-to-current-version.sh
/usr/config/utility/refresh-moti-sample-data.sh

echo "Finished refreshing database schema in MOTI ORBC database..."