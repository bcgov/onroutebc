# onRouteBC Database Migration Scripts
## The Quick Version
If you know what you're doing, have your environment already set up with the git repository checked out to ~/tmp/, and just want the list of commands here they are:
```
cd ~/tmp/onroutebc
git restore *
git pull
cd database/mssql/scripts/utility
rm -rf ../tmp
mkdir ../tmp
chmod u+x ./*.sh
./get-db-status.sh
```
Then issue the command you need, from one of the commands below:
```
./migrate-db-single.sh
./migrate-db-current.sh
./revert-db-single.sh
./revert-db-complete.sh
./reset-moti-db.sh
```
## Environment Setup
### Programs
The ORBC database migration scripts must be executed from a bash shell, ideally from a linux computer. WSL Ubuntu works well for this if you are on a modern Windows system.  
On the linux system the following programs must be installed:  
- sqlcmd (https://learn.microsoft.com/en-us/sql/linux/sql-server-linux-setup-tools?view=sql-server-ver16&tabs=ubuntu-install)
  - sqlcmd must be in the PATH - it is called using simply 'sqlcmd'
- git (https://www.atlassian.com/git/tutorials/install-git#linux)

If you using a modern linux distribution you will have everything else the scripts need. Otherwise, if you are using a barebones distribution some other things may come up that need to be installed (not confirmed).

### Environment Variables
The scripts rely on some environment variables to find resources and to define the connection to the database:
- MSSQL_MOTI_HOST: FQDN of the server hosting the target SQL Server instance
- MSSQL_MOTI_USER: Username for connecting to the ORBC database - must have permissions to create / drop tables
- MSSQL_MOTI_DB: Name of the ORBC database in SQL Server
- MSSQL_MOTI_PASSWORD: Password for the MSSQL_MOTI_USER in the SQL Server instance.
- SCRIPT_DIR: Full path to the orbc/database/mssql/scripts directory where it is located on the linux system (see below for instructions on cloning the git repository and choosing that location)
- MSSQL_LOAD_SAMPLE_DATA: **Optional**. If this variable is set to 1 then sample data will be loaded into the ORBC database as part of the database reset script. This is typically used for dev and test environments, never for production.

Copy and edit the following commands to set the environment variables:
```
export MSSQL_MOTI_HOST=...sql server hostname...
export MSSQL_MOTI_USER=...sql server user...
export MSSQL_MOTI_PASSWORD=...password for sql server user...
export MSSQL_MOTI_DB=...orbc database name...
export SCRIPT_DIR=~/tmp/onroutebc/database/mssql/scripts
export MSSQL_LOAD_SAMPLE_DATA=0  # Or 1 if you are loading sample data into dev/test
```

### Repository Clone
You must have an up-to-date onRouteBC git repository cloned to your linux computer. A good location for this would be ~/tmp, but you can choose any directory you have full control over.  
Issue the following commands to clone the repository (assumes you will be using ~/tmp):
```
mkdir ~/tmp
cd ~/tmp
git clone https://github.com/bcgov/onroutebc.git
```
Once you have cloned the repository once, you do not need to re-clone every time, you just need to pull recent changes:
```
cd ~/tmp/onroutebc
git pull
```
You may need to issue a git restore command if git cannot pull changes due to conflicts. You will be modifying file properties to make scripts executable, and these changes may conflict with changes made to the scripts and committed to the repository. Ensure you haven't made any changes to the repository that you need to keep (make backup copies elsewhere if so), and issue the following command before the git pull:
```
git restore *
```
### Temporary Directory
You need a temporary directory for base64-encoded DDL scripts before they are saved to the database. Create it and set full permissions:
```
mkdir ~/tmp/onroutebc/database/mssql/scripts/tmp
chmod 777 ~/tmp/onroutebc/database/mssql/scripts/tmp
```
You should not have to re-create this directory once you have created it once.
### File Execute Permissions
In order to execute the scripts, you must mark them as executable:
```
chmod u+x ~/tmp/onroutebc/database/mssql/scripts/utility/*.sh
```
If you have had to issue ```git restore *``` earlier, you will need to re-run the above command.
## Script Reference
### get-db-status.sh
Outputs information about your environment, and about the ORBC database version. This can be safely run at any time and is recommended to run prior to doing any tasks, and run after every script that may modify the database.  
Here is an example of output from the script:
```
onRouteBC database connection details:
MSSQL_MOTI_USER variable: sa
MSSQL_MOTI_HOST variable: sql-server-db
MSSQL_MOTI_DB variable: ORBC_DEV
MSSQL_MOTI_PASSWORD variable is set

SCRIPT_DIR variable: /home/john/tmp/onroutebc/database/mssql/scripts
sqlcmd utility found
onRouteBC database version: 9
onRouteBC maximum database version: 9
```
The script intentionally does not output the actual password in case it is being used on a screenshare or is being recorded. If you need to verify the password that is set in the environment variable you can call ```echo $MSSQL_MOTI_PASSWORD```.  
If the get-db-status.sh script reports any errors, such as being unable to retrieve the current or maximum database version, these errors must be fixed before running any of the other migration scripts.  
The onRouteBC database version is the current version of the ORBC database that's deployed in the target SQL Server instance. The onRouteBC maximum database version is the maximum version that the ORBC database can be migrated up to, based on whether there are new database scripts in the git repository that have not yet been deployed.
### migrate-db-single.sh
Migrates the ORBC database up one version (e.g. from version 8 to version 9).  
The script outputs information about the system and requires you to type yes or the script will be cancelled. Please read the output information carefully to ensure the script is doing what you intend. Example:
```
You are about to migrate the ORBC_DEV database on sql-server-db as user sa from version 8 to version 9
You can override the database connection details with the following parameters passed to the script:
    [-u ORBC_USER] [-p ORBC_PASS] [-s ORBC_SERVER] [-d ORBC_DATABASE]
If parameters are not supplied, the connection details will be read from the following environment variables:
    MSSQL_MOTI_USER  MSSQL_MOTI_PASSWORD  MSSQL_MOTI_HOST  MSSQL_MOTI_DB
Are you sure you want to migrate the database? [yes | no]
```
You don't actually need to type 'no' for the script to be cancelled; anything other than yes will cancel the script.
```
User cancelled
```
If there are no higher versions of the ORBC available (i.e. it is already at the highest available version), the script will exit with a message saying there are no further versions. Example:
```
There are no higher database versions available (db currently at version 9)
```
### migrate-db-current.sh
Migrates the ORBC database up to the most current available. This may migrate multiple versions in sequence if there are multiple new database versions available that are not yet deployed.  
As with migrate-db-single.sh, read the output information carefully before typing yes. Example:
```
You are about to migrate the ORBC_DEV database on sql-server-db as user sa from version 7 to version 9
You can override the database connection details with the following parameters passed to the script:
    [-u ORBC_USER] [-p ORBC_PASS] [-s ORBC_SERVER] [-d ORBC_DATABASE]
If parameters are not supplied, the connection details will be read from the following environment variables:
    MSSQL_MOTI_USER  MSSQL_MOTI_PASSWORD  MSSQL_MOTI_HOST  MSSQL_MOTI_DB
Are you sure you want to migrate the database? [yes | no]
```
As with migrate-db-single.sh, you will be notified if there are no higher database versions available.
### revert-db-single.sh (**DESTRUCTIVE**)
Reverts the ORBC database one version (e.g. from version 9 to version 8).  
This is a dangerous operation because it is destructive and should be used only in extreme situations in production. In lower environments it is less critical because there is not critical data that must be saved. In production there is a very real chance of data loss because tables containing business data may be dropped.  
Because it is destructive, it is even more important to read the output information **CAREFULLY** before typing yes and committing to the action. Example output:
```
You are about to revert the ORBC_DEV database on sql-server-db as user sa from version 7 to version 6
You can override the database connection details with the following parameters passed to the script:
    [-u ORBC_USER] [-p ORBC_PASS] [-s ORBC_SERVER] [-d ORBC_DATABASE]
If parameters are not supplied, the connection details will be read from the following environment variables:
    MSSQL_MOTI_USER  MSSQL_MOTI_PASSWORD  MSSQL_MOTI_HOST  MSSQL_MOTI_DB
THIS IS A DESTRUCTIVE OPERATION!
Are you sure you want to revert the database? [yes | no]
```
Typing anything other than yes (including just hitting enter) will cancel the script with no changes made to the database.  
If the database is already at initial state (version 0), executing this script does nothing:
```
ORBC database already at version zero; nothing to revert.
```
### revert-db-complete.sh (**DESTRUCTIVE**)
Reverts the ORBC database completely, deleting all tables and resulting in a completely empty database state.  
This is a completely destructive operation and should typically only be issued in lower environments.  
As with the revert-db-single.sh script, read the output information **CAREFULLY** before typing yes and committing to the action. Example output:
```
You are about to completely revert the ORBC_DEV database on sql-server-db as user sa from version 9 to version 0 (empty state)
You can override the database connection details with the following parameters passed to the script:
    [-u ORBC_USER] [-p ORBC_PASS] [-s ORBC_SERVER] [-d ORBC_DATABASE]
If parameters are not supplied, the connection details will be read from the following environment variables:
    MSSQL_MOTI_USER  MSSQL_MOTI_PASSWORD  MSSQL_MOTI_HOST  MSSQL_MOTI_DB
THIS IS A DESTRUCTIVE OPERATION!
Are you sure you want to completely revert the database? [yes | no]
```
Typing anything other than yes (including just hitting enter) will cancel the script with no changes made to the database.  
If the database is already at initial state (version 0), executing this script does nothing:
```
ORBC database already at version zero; nothing to revert.
```
### reset-moti-db.sh (**DESTRUCTIVE**)
Reverts the database back to empty state, then builds the database back up to the most current version available in the repository. This is used as a clean slate database rebuild for dev and other lower environments.  
Internally, this script invokes revert_db_complete followed by migrate_db_current.  
In addition to the database schema rebuild, this script optionally loads sample data into the database when complete, useful for dev and other lower environments. The ```MSSQL_LOAD_SAMPLE_DATA=1``` environment variable must be set to trigger sample data load.  
As a destructive operation, please read the output information **CAREFULLY** before typing yes and committing to the action. Example output:
```
You are about to completely reset the ORBC_DEV database on sql-server-db as user sa.
This involves reverting the database to a clean state (losing all data), and rebuilding the database to the most current version available.
To load sample data into the database once it has been rebuilt set the MSSQL_LOAD_SAMPLE_DATA environment variable to 1.
THIS IS A DESTRUCTIVE OPERATION!
Are you sure you want to completely reset the database? [yes | no]
```
Typing anything other than yes (including just hitting enter) will cancel the script with no changes made to the database.  
This script may be run with the database in any state (including version 0), and will always bring the database up to the most current version available in the repository.