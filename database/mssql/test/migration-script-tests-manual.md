# Manual test suite for database version scripts

## Environment: local (docker)
* variable: MSSQL_RUN_TESTS=1
* variable: MSSQL_HOST=sql-server-db
* variable: MSSQL_SA_USER=SA
* variable: MSSQL_SA_PASSWORD=xxxx
* variable: MSSQL_DB=ORBC_DEV
* variable: MSSQL_LOAD_SAMPLE_DATA=1
  
Run sql-server-db docker container, review logs for errors
* Tests should run and output messages that each passed. There should be no messages about failed tests.
* There should be messages output for test migrations and reverts
  
Enter console on docker container once it has finished initializing
* Log message ends with 'Finished loading sample data', ensure initialization is complete by waiting 10 seconds minimum after that message appears
* Console entered via the 'Exec' tab in Docker Desktop
  
```
    bash
    cd /usr/config/utility
```
## Tests to ensure status is reported correctly for different scenarios
```
unset MSSQL_MOTI_USER
unset MSSQL_MOTI_PASSWORD
unset MSSQL_MOTI_HOST
unset MSSQL_MOTI_DB
unset SCRIPT_DIR
unset MSSQL_LOAD_SAMPLE_DATA
export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
./get-db-status.sh
```
Should output blank values for env variables, notify you that sqlcmd is not available, notify you that database version could not be retrieved

### Set invalid SCRIPT_DIR
```
export SCRIPT_DIR=/usr
./get-db-status.sh
```
Same result as before, notification about invalid SCRIPT_DIR
### Set valid SCRIPT_DIR
```
SCRIPT_DIR=/usr/config
./get-db-status.sh
```
Still notifications about missing variables, now will output onRouteBC maximum database version
### Set path to include sqlcmd
```
PATH="/opt/mssql-tools/bin:$PATH"
./get-db-status.sh
```
Will now get a notification that the sqlcmd utility is available, but error retrieving onRouteBC database version
### Set valid database connection for local db
```
export MSSQL_MOTI_USER=SA
export MSSQL_MOTI_PASSWORD=***** # Enter local db password
export MSSQL_MOTI_HOST=sql-server-db
export MSSQL_MOTI_DB=ORBC_DEV
./get-db-status.sh
```
Will output proper status, including current database version, maximum database version (which will match current version)

## Tests to ensure migrate up scripts do not attempt to migrate beyond max version
```
./migrate-db-single.sh
./migrate-db-current.sh
```
Both scripts will notify user that db is already at the maximum version

## Tests to ensure revert scripts allow user to cancel operation with no impact
```
./revert-db-single.sh
```
You will receive a message with option to cancel. Enter any value other than yes as your response
```
no  # <-- for example
```
You will get a message that 'user cancelled', and no changes will be made to the database. Confirm by running status
```
./get-db-status.sh
```
The database will still be at the same version as last time you ran the status script.
### Now run these same steps for the revert-db-complete script
```
./revert-db-complete.sh
no
./get-db-status.sh
```
## Test to ensure revert single scripts run as expected
```
./revert-db-single.sh
yes
./get-db-status.sh
```
You will be presented with a message that the database was reverted 1 version
### Run again
```
./revert-db-single.sh
yes
./get-db-status.sh
```
Database version will be currently 2 versions below where it started (and 2 below maximum)

## Tests to ensure migrate scripts allow user to cancel operation with no impact
```
./migrate-db-single.sh
```
You will receive a message with option to cancel. Enter any value other than yes as your response
```
no  # <-- for example
```
You will get a message that 'user cancelled', and no changes will be made to the database. Confirm by running status
```
./get-db-status.sh
```
The database will still be at the same version as last time you ran the status script.
### Now run these same steps for the migrate-db-current script
```
./migrate-db-current.sh
no
./get-db-status.sh
```
Again, user cancelled message with no action taken.

## Test to ensure migrate single scripts run as expected
```
./migrate-db-single.sh
yes
./get-db-status.sh
```
You will be presented with a message that the database was migrated 1 version
### Run again
```
./migrate-db-single.sh
yes
./get-db-status.sh
```
Database version will be where it started, back at maximum

## Test to ensure revert complete script runs as expected
```
./revert-db-complete.sh
yes
./get-db-status.sh
```
The database will now be at version 0.  
Connect to DB using SSMS to verify there are no tables in the ORBC database at this point.

## Test to ensure migrate current script runs as expected
```
./migrate-db-current.sh
yes
./get-db-status.sh
```
The database will now be at maximum version (where we started).  
Connect to DB using SSMS to verify all tables exist in the ORBC database at this point (as far as you are able, just look for many tables if unsure of what the state is supposed to be).

## Test the reset script
### Test that the reset script can be cancelled with no database impacts
```
./revert-db-single.sh
yes
./get-db-status.sh
./reset-moti-db.sh
no # <-- for example
./get-db-status.sh
```
You will still be at one version below maximum (the reset script did not reset the database to maximum)

### Confirm that you have sample data load OFF and run the reset-moti-db script
```
unset MSSQL_LOAD_SAMPLE_DATA # already done earlier, but confirm anyway
./reset-moti-db.sh
yes
./get-db-status.sh
```
Database will be at maximum version again, and sample data was not loaded.  
Confirm with SSMS that there are zero sample records in the ORBC_COMPANY table.
### Set sample data load to ON and run the reset-moti-db script
```
export MSSQL_LOAD_SAMPLE_DATA=1
./reset-moti-db.sh
yes
./get-db-status.sh
```
Database will be at maximum version again after being reverted and restored, and sample data will be loaded.  
Confirm with SSMS that there are records in the ORBC_COMPANY table.