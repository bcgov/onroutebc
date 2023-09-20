#!/bin/bash

# Legacy script added to allow migration from the old database revert script
# style to the new style.
#
# This script may be deleted from the repository (along with all other scripts
# in the legacy directory along with the legacy directory itself) once all
# database instances (dev, test, demo, uat, prod, etc) have been updates.
#
# This script will revert the target database to empty state using the revert
# scripts in the git repository instead of the revert scripts saved in the
# database itself.
#
# Once reverted, the standard reset-moti-db.sh or migrate-db-current.sh scripts
# may be executed against the target database going forward and this script
# is no longer used.
${SCRIPT_DIR}/utility/legacy/revert-db-complete.sh -u ${MSSQL_MOTI_USER} -p "${MSSQL_MOTI_PASSWORD}" -s ${MSSQL_MOTI_HOST} -d ${MSSQL_MOTI_DB}