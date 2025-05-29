import { Box } from "@mui/material";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { RowSelectionState } from "@tanstack/table-core";
import { useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";

import {
  MaterialReactTable,
  MRT_Row,
  useMaterialReactTable,
} from "material-react-table";

import { SnackBarContext } from "../../../App";
import { DeleteConfirmationDialog } from "../../../common/components/dialog/DeleteConfirmationDialog";
import { NoRecordsFound } from "../../../common/components/table/NoRecordsFound";
import { TrashButton } from "../../../common/components/buttons/TrashButton";
import {
  defaultTableInitialStateOptions,
  defaultTableOptions,
  defaultTableStateOptions,
} from "../../../common/helpers/tableHelper";
import {
  useDeleteCompanyActiveUsers,
  useDeleteCompanyPendingUsers,
} from "../apiManager/hooks";
import { getCompanyUsers } from "../apiManager/manageProfileAPI";
import { UserManagementTableRowActions } from "../components/user-management/UserManagementRowOptions";
import {
  BCeID_USER_STATUS,
  BCeIDUserStatusType,
  ReadUserInformationResponse,
} from "../types/manageProfile.d";
import { UserManagementColumnsDefinition } from "../types/UserManagementColumns";
import "./UserManagement.scss";
import { usePermissionMatrix } from "../../../common/authentication/PermissionMatrix";

/**
 * User Management Component for CV Client.
 */
export const UserManagement = () => {
  const query = useQuery({
    queryKey: ["companyUsers"],
    queryFn: getCompanyUsers,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    retry: 1,
  });
  const { data, isError, isLoading } = query;
  const { setSnackBar } = useContext(SnackBarContext);
  const { user: userFromToken } = useAuth();

  const deletePendingUsersMutation = useDeleteCompanyPendingUsers();
  const deleteActiveUsersMutation = useDeleteCompanyActiveUsers();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  /**
   * rowSelection is a Record<string, boolean>. The key follows the pattern
   * - {userGUID},{ACTIVE} (if existing user)
   * - {userName},{PENDING} (if pending user)
   * This is a conscious design choice so that we can quickly
   * recognize whether a selected user is ACTIVE or PENDING.
   * The alternative will be to create another state with lot more
   * processing to figure out the distinction between ACTIVE and PENDING.
   *
   * Why do we need this distinction?
   * - Users selected for deletion will use two different APIs for pending and active users
   *
   */
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const hasNoRowsSelected = Object.keys(rowSelection).length === 0;

  /**
   * Callback function for clicking on the Trash icon above the Table.
   */
  const onClickTrashIcon = useCallback(() => {
    setIsDeleteDialogOpen(() => true);
  }, []);

  /**
   * Retrieves user identifiers based on their status from the row selection state.
   * @param {BCeIDUserStatusType} userStatus The status of the users to filter by.
   * @returns {string[]} An array of user identifiers (either user names or GUIDs)
   *                     based on the requested status.
   */
  const getSelectedUsers = useCallback(
    (userStatus: BCeIDUserStatusType) =>
      Object.keys(rowSelection)
        .filter((value: string) => value.split(",")[1] === userStatus)
        .map((value: string) => value.split(",")[0]),
    [rowSelection],
  );

  /**
   * Function that deletes one or more users.
   */
  const onConfirmDelete = async () => {
    setIsDeleteDialogOpen(() => false);
    const userNames: string[] = getSelectedUsers(BCeID_USER_STATUS.PENDING);
    const userGUIDs: string[] = getSelectedUsers(BCeID_USER_STATUS.ACTIVE);
    if (userNames.length > 0) {
      await deletePendingUsersMutation.mutateAsync(userNames);
    }
    if (userGUIDs.length > 0) {
      await deleteActiveUsersMutation.mutateAsync(userGUIDs);
    }
    setRowSelection(() => {
      return {};
    });
    query.refetch();
  };

  /**
   * Function that clears the delete related states when the user clicks on cancel.
   */
  const onCancelDelete = useCallback(() => {
    setIsDeleteDialogOpen(() => false);
    setRowSelection(() => {
      return {};
    });
  }, []);

  useEffect(() => {
    if (isError) {
      setSnackBar({
        message: "An unexpected error occurred.",
        showSnackbar: true,
        setShowSnackbar: () => true,
        alertType: "error",
      });
    }
  }, [isError]);

  const canRemoveUser = usePermissionMatrix({
    permissionMatrixKeys: {
      permissionMatrixFeatureKey: "MANAGE_PROFILE",
      permissionMatrixFunctionKey: "REMOVE_USER",
    },
  });

  const canEditUser = usePermissionMatrix({
    permissionMatrixKeys: {
      permissionMatrixFeatureKey: "MANAGE_PROFILE",
      permissionMatrixFunctionKey: "EDIT_USER",
    },
  });

  const table = useMaterialReactTable({
    ...defaultTableOptions,
    columns: UserManagementColumnsDefinition,
    data: data ?? [],
    initialState: {
      ...defaultTableInitialStateOptions,
    },
    state: {
      ...defaultTableStateOptions,
      showAlertBanner: isError,
      showProgressBars: isLoading,
      columnVisibility: { applicationId: true },
      isLoading: isLoading,
      rowSelection: rowSelection,
    },
    enableGlobalFilter: false,
    renderEmptyRowsFallback: () => <NoRecordsFound />,
    enableRowSelection: (
      row: MRT_Row<ReadUserInformationResponse>,
    ): boolean => {
      if (!canRemoveUser) {
        return false;
      }
      if (row?.original?.userGUID === userFromToken?.profile?.bceid_user_guid) {
        return false;
      }
      return true;
    },
    onRowSelectionChange: setRowSelection,
    getRowId: (originalRow: ReadUserInformationResponse) => {
      const { statusCode, userName, userGUID } = originalRow;
      if (statusCode === BCeID_USER_STATUS.PENDING) {
        return `${userName},${statusCode}`;
      } else {
        return `${userGUID},${statusCode}`;
      }
    },
    displayColumnDefOptions: {
      "mrt-row-actions": {
        header: "",
      },
    },
    renderRowActions: useCallback(
      ({ row }: { row: MRT_Row<ReadUserInformationResponse> }) => {
        if (
          row.original.statusCode === BCeID_USER_STATUS.ACTIVE &&
          canEditUser
        ) {
          return (
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <UserManagementTableRowActions userGUID={row.original.userGUID} />
            </Box>
          );
        } else {
          return <></>;
        }
      },
      [],
    ),
    renderToolbarInternalActions: useCallback(
      () => (
        <Box className="table-container__toolbar-internal-actions">
          <TrashButton
            onClickTrash={onClickTrashIcon}
            disabled={hasNoRowsSelected || !canRemoveUser}
          />
        </Box>
      ),
      [hasNoRowsSelected],
    ),
    muiToolbarAlertBannerProps: isError
      ? {
          color: "error",
          children: "Error loading data",
        }
      : undefined,
  });

  return (
    <div className="table-container">
      <MaterialReactTable table={table} />
      <DeleteConfirmationDialog
        onDelete={onConfirmDelete}
        showDialog={isDeleteDialogOpen}
        onCancel={onCancelDelete}
        itemToDelete="user"
      />
    </div>
  );
};
