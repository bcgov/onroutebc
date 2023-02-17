# Database Schema and Versioning Guide
## Database Architecture

### Ministry-Hosted Databases

Ministry of Transportation and Infrastructure (MOTI) hosts MS SQL Server instances on-premises for development, test, and production. The onRouteBC database names for dev, test, and prod in the hosted MOTI environment are, respectively:
* ORBC_DEV
* ORBC_TST
* ORBC_PRD

Dev, test, and prod databases are all accessed via their own DNS names from the OpenShift application hosting environment.

### Development Database

Local development uses a mssql Docker container which runs on each developer's machine. The local SQL Server database in Docker is rebuilt from scratch whenever the container starts up - there is no persistent disk storage. See the section below on the [Local Build Process](#local-build-process) for more details.

## Versioning Approach

Changes to the database (such as those required by new application enhancements) are implemented using SQL DDL statements which are applied to the current database version. For example, adding a column to an existing table would require an `ALTER TABLE` statement. It is vital that database update statements do not impact the integrity of the existing data - this will be verified by the MOTI database team prior to executing the scripts against the production database.

DDL statements to update the database are grouped together into a single SQL file for all changes that must happen at the same time (e.g. for a single application release). The group of DDL statements in a single SQL file represent a single database __version__. A version is identified by an integer, starting at 1 (for the first database version) and incrementing by 1 for each subsequent version.

### Versions Table

When a single DDL version (SQL file with one or more DDL statements) is executed against the database, a record is added to the ORBC_SYS_VERSION table. The record indicates the version number, a description of the change, the timestamp of when the DDL was executed, and the SHA-1 hash of the SQL file itself. The current version of the database can be retrieved by querying the ORBC_SYS_VERSION table for the version number corresponding to the most recent execution timestamp (i.e. the most recent DDL that was run).

### Reverting Versions

For each version SQL file there is a corresponding SQL file containing DDL statements to revert all changes that the version SQL made to the database. For example, if a version SQL included a `CREATE TABLE` statement, the revert SQL would contain a corresponding `DROP TABLE` statement to revert the change.

The intention of the revert SQL files is to roll back changes to the production or test databases if a problem is discovered soon after deployment. Since the revert scripts can be destructive, take __extreme caution__ when executing them against the production database if users have already begun using the onRouteBC application since the database version was applied.

When a revert SQL file is executed against the database, a new record is added to the ORBC_SYS_VERSION table, decrementing the current version of the database. The full history of all version upgrades and reverts is therefore preserved in the ORBC_SYS_VERSION table.

> The version SQL files and revert SQL files are intended to be run sequentially (in order) and only moving the database version up or down by a single version number at a time. For example, to migrate the database from version 5 to version 7 first execute the version 6 DDL file then execute the version 7 DDL file.

### Version SQL File Naming Convention

SQL version files are located in the repository at `/database/mssql/scripts/versions/`, with the revert scripts located in a `/revert/` subdirectory of this. SQL upgrade scripts are named as follows:

    v_<version>_ddl.sql (example: v_1_ddl.sql)

The revert scripts are named as follows:

    v_<version>_ddl_revert.sql (example: v_1_revert_ddl.sql)

For details of the content and structure of the SQL files and how to create your own version file, see [How To Create a New Version](#how-to-create-a-new-version) below.

## Local Build Process

Local development uses a SQL Server Docker container. Refer to the `Dockerfile` in the `/database/` directory of the repository for the most up to date details of the source and files copied into the container.

On build of the Docker container, the `configure-db.sh` script is automatically executed. This does the following:
* Creates a new database in the SQL Server Docker instance.
* Executes a suite of tests (see [below](#unit-tests) for details).
* Executes each version SQL that it finds in the `/database/mssql/scripts/versions/` directory in sequence, starting at version 1 (see [above](#version-sql-file-naming-convention) for file naming conventions).
* Loads the database with sample data (see [below](#sample-data) for details).

`configure-db.sh` calls utility scripts in the `/database/mssql/scripts/utility/` directory to perform upgrade and revert actions. These utility scripts can be executed manually from a terminal in the running Docker container if needed. The utility scripts are well commented so refer to the scripts themselves for information on how they are used.

> The SQL DDL files are executed using the sqlcmd program in the SQL Server Docker container.

The local build process requires a number of environment variables set in the Docker container host. These environment variables are automatically set in the host from a secret `.env` file in the developer's repository root. Refer to the `docker-compose.yml` file in the repository root and the `Dockerfile` in the `/database/` directory for the most up to date list of environment variables required for the `sql-server-db` container.

### Unit Tests

When the SQL Server Docker container is built, a series of test scripts are executed, one per database version. This is managed by the `/database/mssql/test/test-runner.sh` script. The test runner does the following:
* Creates a new test database in the SQL Server Docker instance.
* Executes each version SQL that it finds in the `/database/mssql/scripts/versions/` directory in sequence, starting at version 1.
  * After each version SQL is executed, execute the corresponding version test file, found in the `/database/mssql/test/versions/` directory. The naming convention of the test scripts is `v_<version>_test.sh` (example: `v_1_test.sh`).
* Once the database is at the most current, reverts the database one version at a time using the revert scripts in `/database/mssql/scripts/versions/revert/` directory.
  * After each revert SQL is executed, executes again the corresponding version test file.
* Executes the full migrate utility script at `/database/mssql/scripts/utility/migrate-db-current.sh`.
* Executes the full revert utility script at `/database/mssql/scripts/utility/revert-db-complete.sh`.
* Executes the full database reset utility script (this includes sample data population) at `/database/mssql/scripts/utility/reset-moti-db.sh`.
  * Note that database connection environment variables are overridden before this final test is done - see the code comments in `test-runner.sh` for details.
* Drops the test database.

> Note 1: The unit test results (pass/fail) do not prevent building, the results are only output to the console. As such, to see the results of the unit tests review the console logs of the local Docker container after build.

> Note 2: Currently the unit tests are very rudimentary but can be expanded to include more robust checks (such as data integrity checks etc.) as needed.

> Note 3: A unit test script file __must__ be present for each database version SQL file. If tests are not needed (or if there is no time to write one) for a particular database version, create an empty test script file with a single `echo` statement.

## How To Create a New Version

* Make a copy of the `/database/mssql/scripts/versions/sample-ddl.sql` file, and name it according to the pattern `v_<version>_ddl.sql` (match the naming convention of the other version SQL files in that same directory).  
  * Ensure the new version is one higher than the most current highest version SQL file in the directory. It'll make sense when you look in the versions directory.
  * Insert the DDL needed for the new database version into the main body of the new version SQL file (the comments in the file will indicate where this should be inserted).
  * Update the description of the new database version, replacing the text `*** Enter description of DB change here ***`
  * Update the integer version number, replacing the text `/*<<REPLACE VERSION NUMBER HERE>>*/`.
* Make another copy of the `/database/mssql/scripts/versions/sample-ddl.sql` file into the `/database/mssql/scripts/versions/revert/` directory, and name it according to the pattern `v_<version>_ddl_revert.sql` (match the naming convention of the other version SQL files in that same directory).
  * Insert the DDL needed to revert the new database version - drop any object your new version created, delete any data your new version inserted; in short, revert everything your new version did to get back to an identical state the database was in before your version was deployed.
  * Like you did for the SQL version file, update the description and integer version number in the revert SQL script. Note that for the revert script, the integer version number should be your new SQL version minus one. Have a look at the other existing revert scripts if you need more clarification.
* Create a test script for your new version (even if it has nothing more than a single `echo` statement, it must exist). Copy an existing test script (`.sh` file) from the `/database/mssql/test/versions/` directory, name it according to your new version number, and use it for reference.

Depending on the nature of the database change you may be able to make the database change directly in the local Docker MS SQL Server using SQL Server Management Studio, then export the changes (new objects, new lookup data values, etc.) from SSMS as DDL. This works well when creating new tables. If changes are required to existing objects then you may need to either hand-craft the DDL or use a third-party tool to get the deltas.

> Note 1: do not script the `USE DATABASE <DBNAME>` statement because the database name is different in each environment and the SQL scripts must work identically in all environments. The utility scripts are responsible for supplying the name of the database from environment variables.

> Note 2: avoid changing previous version SQL DDL files - if changes are needed then create a new SQL DDL file with a new version and write DDL to alter the database instead. The exception to this rule is during the initial development phase before the application is released - it's usually better to update the previous version SQL in this case to avoid cluttering the version history while the database schema is in constant flux.

> Note 3: When generating DDL target SQL Server 2017 so that it is compatible with the hosted MOTI database.

## Updating the MOTI Hosted Database

Once the onRouteBC application is deployed into OpenShift (dev, test, or prod) it points to the hosted MOTI database, not the local Docker instance. The hosted MOTI database is not automatically rebuilt when the application is deployed, so this step is manual.

A script has been created which performs a complete database refresh (schema plus sample data); this is intended to be run against the MOTI hosted dev database whenever changes are made or whenever the data becomes corrupt or cluttered in dev. The script is:

    /database/mssql/scripts/utility/reset-moti-db.sh

The script is intended to be executed from the SQL Server Docker container shell, and requires 4 environment variables which are automatically set from the `.env` secrets file in a developer's environment in the repository root. Refer to the comments in the `reset-moti-db.sh` file for the most up-to-date information about these environment variables and how to run the script.

> If you are running the script from the shell of your local Docker SQL Server instance, you must be connected to the BC Gov VPN or you won't be able to reach the hosted MOTI DB.

For test and production, the database updates are expected to be individually executed and manually performed by members of the MOTI DBA team. However, the same DDL SQL scripts should be used and the utility scripts can also likely be employed for convenience and consistency.

## Sample Data

A small set of sample data (~100 records in each data table) is loaded into the local Docker SQL Server database when the container is built. The same set of sample data is loaded into the hosted MOTI database when the `reset-moti-db.sh` script is executed (see [above](#updating-the-moti-hosted-database)).

The sample data was generated originally in [mockaroo](https://www.mockaroo.com) but is saved in the repository as DML insert statements in the `/database/mssql/scripts/sampledata/` directory. The DML insert statements were generated from SQL Server Management Studio.

### Adding New Sample Data

The sample data is saved as multiple SQL files containing insert statements, one file per table. If you need to add sample data (for existing test users for example) and a file already exists in the sample data folder (such as ORBC_POWER_UNIT), the new sample data can simply be added to the existing SQL files and it will be inserted next time the SQL Docker container is built.

If you need to add sample data to a new table (there is no existing SQL file in the sample data directory), do the following:

* Generate sample data using mockaroo, or another sample data generation tool.
* Load the sample data into your local Docker SQL database, either from a CSV file or any other mechanism (ETL tool, etc.).
* Export the data using SQL Server Management Studio.
  * Target SQL Server version 2017.
  * Remember to export 'data only', not 'schema only' or 'schema and data'.
* Save the SQL file into the `/database/mssql/scripts/sampledata/` directory, matching the naming convention of the other sample data SQL files in that directory.
* Update the `/database/mssql/scripts/utility/refresh-sample-data.sh` script to add a line for deleting data from the table and a line for loading data into the table. This is mostly a copy and paste using the convention for other sample data tables.
  * See the `refresh-sample-data.sh` script for more information.

> Note 1: make sure the order that you delete and add sample data does not violate any foreign key constraints or the sample data load will fail. Test the load before committing the change to the repository to make sure it all looks as it should.

---

doc search guid: 5d11a412-2fb7-4fc8-a232-47d1390b099c