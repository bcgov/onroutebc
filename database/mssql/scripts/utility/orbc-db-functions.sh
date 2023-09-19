#!/bin/bash

# Retrieve the version of the ORBC database from the version history table.
# If the version history table does not exist then a value of zero (0) will
# be returned.
function get_orbc_db_version {
  orbc_db_version=$( sqlcmd -C -U ${1} -P "${2}" -S ${3} -v DB_NAME=${4} -b -h -1 -i ${SCRIPT_DIR}/get-orbc-db-version.sql )
  if (( $? > 0 )); then
    echo "Error retrieving ORBC db version for user '${1}' on server '${3}'."
    return 1
  else
    # Valid output from sqlcmd is an integer with leading spaces; coax into 
    # something better resembling an int for output purposes.
    (( orbc_db_version=orbc_db_version+0 ))
    echo "ORBC DB Version: ${orbc_db_version}"
  fi
}

# Gets the maximum version the ORBC database can be upgraded to, based on
# the migration scripts available in the checked out git repository.
# Sets the max db version to a variable named orbc_max_db_version.
function get_max_db_version {
  local nextver=1

  while [[ -f "${SCRIPT_DIR}/versions/v_${nextver}_ddl.sql" ]] && [[ -f "${SCRIPT_DIR}/versions/revert/v_${nextver}_ddl_revert.sql" ]]; do
    (( nextver=nextver+1 ))
  done
  orbc_max_db_version=$(( nextver-1 ))
  echo "Maximum ORBC db version is ${orbc_max_db_version}"
}

# Reverts all versions of the database, using the revert script that was stored
# in the database for that version when the version was created.
#
# This script assumes a SCRIPT_DIR environment variable has been set, indicating the
# root database scripts directory.
# DDL files must be in the database/mssql/scripts/versions/revert directory in
# git, and in ${SCRIPT_DIR}/versions/revert directory on the computer this script
# is running on.
function revert_db_complete {
  get_orbc_db_version ${1} "${2}" "${3}" ${4}
  if (( $? > 0 )); then
    echo "Could not retrieve orbc db version, exiting revert script."
    exit 1
  fi

  if (( orbc_db_version > 0 )); then
    echo "Reverting database to empty state..."
    local nextver=$orbc_db_version

    while (( nextver > 0 )); do
      echo "Reverting orbc database from version ${nextver} to version $(( nextver-1 ))"
      revert_db_single ${1} "${2}" "${3}" ${4}
      if (( $? > 0 )); then
        echo "Error reverting single db version; exiting revert script."
        return 1
      else
        (( nextver=nextver-1 ))
      fi
    done

    echo "Finished reverting database to empty state"
  else
    echo "ORBC database already at version 0; nothing to revert."
  fi
}

# Reverts a single version upgrade to the ORBC database
function revert_db_single {
  REVERT_SCRIPT=$( sqlcmd -C -U ${1} -P "${2}" -S ${3} -v DB_NAME=${4} -b -y 0 -i ${SCRIPT_DIR}/get-orbc-db-revert-script.sql )
  if (( $? == 0 )); then
    printf "${REVERT_SCRIPT}" | base64 -di > ${SCRIPT_DIR}/tmp/revert.tmp.sql
    sqlcmd -C -U ${1} -P "${2}" -S ${3} -d ${4} -i ${SCRIPT_DIR}/tmp/revert.tmp.sql

    if (( $? == 0 )); then
      echo "Reverted ORBC database version."
    else
      echo "Error reverting ORBC database version."
      return 1
    fi
  else
    echo "Error retrieving revert script from database."
    return 1
  fi
}

# Executes a single version upgrade to the ORBC database.
function migrate_db_single {
  get_orbc_db_version ${1} "${2}" "${3}" ${4}
  if (( $? > 0 )); then
      echo "Could not retrieve orbc db version, exiting migrate script."
      exit 1
  fi

  local nextver=$(( orbc_db_version+1 ))

  if test -f "${SCRIPT_DIR}/versions/v_${nextver}_ddl.sql"; then
    if test -f "${SCRIPT_DIR}/versions/revert/v_${nextver}_ddl_revert.sql"; then
      echo "Executing ${SCRIPT_DIR}/versions/v_${nextver}_ddl.sql"
      # Set update and revert scripts to base64-encoded variables to be inserted
      # into the DB. Update script is for reference, revert script will be used
      # when the DB needs to be rolled back one version.

      # The reason we export the variables instead of passing them using the -v flag
      # on the sqlcmd line is because = signs are stripped when sending variables
      # through sqlcmd, whereas they are maintained when using global env variables.
      # The stripping of the = signs causes problems with base64 decoding because
      # the padding is represented by =. Bash base64 can still decode but it generates
      # an error, and may not always be reliable.
      export UPDATE_SCRIPT=$( base64 -w 0 <${SCRIPT_DIR}/versions/v_${nextver}_ddl.sql )
      export REVERT_SCRIPT=$( base64 -w 0 <${SCRIPT_DIR}/versions/revert/v_${nextver}_ddl_revert.sql )
      sqlcmd -C -U ${1} -P "${2}" -S ${3} -d ${4} -b -i ${SCRIPT_DIR}/versions/v_${nextver}_ddl.sql
      if (( $? > 0 )); then
        echo "Error upgrading database, exiting migrate script."
        exit 1
      fi
    else
      echo "ERROR: mandatory revert script file ${SCRIPT_DIR}/versions/revert/v_${nextver}_ddl_revert.sql not found. Exiting."
      exit 1
    fi
  else
    echo "ERROR: migration file ${SCRIPT_DIR}/versions/v_${nextver}_ddl.sql not found. Exiting."
    exit 1
  fi

  echo "Upgraded database to version ${nextver}"
}

# Migrates the schema in the ORBC database using the schema DDL files in the
# versions directory.

# This is intended to be run from the local docker sql-server-db container, or
# a similar linux environment with the requisite env variables and sqlcmd
# installed in /opt/mssql-tools/bin/.
function migrate_db_current {
  get_orbc_db_version ${1} "${2}" "${3}" ${4}
  if (( $? > 0 )); then
    echo "Could not retrieve orbc db version, exiting migrate script."
    exit 1
  fi

  get_max_db_version
  if (( $? > 0 )); then
    echo "Could not retrieve max db version, exiting migrate script."
    exit 1
  fi
  
  # Look for new database version DDL files, and execute them in sequence when found.
  # DDL file names match the following pattern: v_N_ddl.sql where N is the version the
  # database will be brought up to after execution.
  # Example: v_2_ddl.sql will migrate the database from version 1 to version 2.

  # This script assumes a SCRIPT_DIR environment variable has been set, indicating the
  # root database scripts directory.
  # DDL files are kept in the database/mssql/scripts/versions/ directory, and are copied
  # into the ${SCRIPT_DIR}/versions/ directory in the container when built.
  echo "Bringing database schema up to version ${orbc_max_db_version}"

  local nextver=$(( orbc_db_version+1 ))

  echo "Initial migration files to look for: ${SCRIPT_DIR}/versions/v_${nextver}_ddl.sql and ${SCRIPT_DIR}/versions/revert/v_${nextver}_ddl_revert.sql"

  while [[ -f "${SCRIPT_DIR}/versions/v_${nextver}_ddl.sql" ]] && [[ -f "${SCRIPT_DIR}/versions/revert/v_${nextver}_ddl_revert.sql" ]]; do
    migrate_db_single ${1} "${2}" ${3} ${4}
    if (( $? > 0 )); then
      echo "Error migrating to version ${nextver}, exiting migrate script."
      exit 1
    fi

    (( nextver=nextver+1 ))
    echo "Next migration files to check: ${SCRIPT_DIR}/versions/v_${nextver}_ddl.sql and ${SCRIPT_DIR}/versions/revert/v_${nextver}_ddl_revert.sql"
  done

  echo "ORBC database migrated to version ${orbc_max_db_version}"
}
