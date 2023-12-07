import { Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { RowSelectionState } from "@tanstack/table-core";
import { useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";

import {
  MaterialReactTable,
  MRT_Row,
  MRT_TableInstance,
  useMaterialReactTable,
} from "material-react-table";

import "./UserManagement.scss";
import { SnackBarContext } from "../../../App";
import { NoRecordsFound } from "../../../common/components/table/NoRecordsFound";
import { FIVE_MINUTES } from "../../../common/constants/constants";
import { DeleteConfirmationDialog } from "../../../common/components/dialog/DeleteConfirmationDialog";
import { Trash } from "../../../common/components/table/options/Trash";
import { getCompanyUsers } from "../apiManager/manageProfileAPI";
import { UserManagementTableRowActions } from "../components/user-management/UserManagementRowOptions";
import { UserManagementColumnsDefinition } from "../types/UserManagementColumns";
import { BCeIDUserStatus, ReadCompanyUser } from "../types/userManagement.d";
import {
  defaultTableInitialStateOptions,
  defaultTableOptions,
  defaultTableStateOptions,
} from "../../../common/constants/defaultTableOptions";

/**
 * User Management Component for CV Client.
 */
export const UserManagement = () => {
  const query = useQuery({
    queryKey: ["companyUsers"],
    queryFn: getCompanyUsers,
    staleTime: FIVE_MINUTES,
  });
  const { data, isError, isInitialLoading } = query;
  const snackBar = useContext(SnackBarContext);
  const { user: userFromToken } = useAuth();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const hasNoRowsSelected = Object.keys(rowSelection).length === 0;

  /**
   * Callback function for clicking on the Trash icon above the Table.
   */
  const onClickTrashIcon = useCallback(() => {
    setIsDeleteDialogOpen(() => true);
  }, []);

  /**
   * Function that deletes one or more users.
   */
  const onConfirmDelete = async () => {
    // Uncomment this line -const userNames: string[] = Object.keys(rowSelection);
    // For implementation.
    setIsDeleteDialogOpen(() => false);
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
      snackBar.setSnackBar({
        message: "An unexpected error occurred.",
        showSnackbar: true,
        setShowSnackbar: () => true,
        alertType: "error",
      });
    }
  }, [isError]);

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
      showProgressBars: isInitialLoading,
      columnVisibility: { applicationId: true },
      isLoading: isInitialLoading,
      rowSelection: rowSelection,
    },
    renderEmptyRowsFallback: () => <NoRecordsFound />,
    enableRowSelection: (row: MRT_Row<ReadCompanyUser>): boolean => {
      if (row?.original?.userGUID === userFromToken?.profile?.bceid_user_guid) {
        return false;
      }
      return true;
    },
    onRowSelectionChange: setRowSelection,
    getRowId: (originalRow: ReadCompanyUser) => originalRow.userName,
    displayColumnDefOptions: {
      "mrt-row-actions": {
        header: "",
      },
    },
    renderRowActions: useCallback(
      ({
        row,
      }: {
        table: MRT_TableInstance<ReadCompanyUser>;
        row: MRT_Row<ReadCompanyUser>;
      }) => {
        if (row.original.statusCode === BCeIDUserStatus.ACTIVE) {
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
          <Trash onClickTrash={onClickTrashIcon} disabled={hasNoRowsSelected} />
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
        onClickDelete={onConfirmDelete}
        isOpen={isDeleteDialogOpen}
        onClickCancel={onCancelDelete}
        caption="user"
      />
    </div>
  );
};
