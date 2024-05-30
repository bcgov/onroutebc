import { Box, Button, Typography } from "@mui/material";
import { RowSelectionState } from "@tanstack/table-core";
import { useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";

import {
  MaterialReactTable,
  MRT_Row,
  useMaterialReactTable,
} from "material-react-table";

import { SnackBarContext } from "../../../../App";
import { RemoveUserModal } from "./RemoveUserModal";
import { NoRecordsFound } from "../../../../common/components/table/NoRecordsFound";
import {
  defaultTableInitialStateOptions,
  defaultTableOptions,
  defaultTableStateOptions,
} from "../../../../common/helpers/tableHelper";
import {
  useGetCreditAccountQuery,
  useRemoveCreditAccountUsersMutation,
} from "../../hooks/creditAccount";
import { CreditAccountUserColumnsDefinition } from "../../types/CreditAccountUserColumns";
import { CompanyProfile } from "../../../manageProfile/types/manageProfile.d";
import "./UserTable.scss";

/**
 * User Management Component for CV Client.
 */
export const UserTable = () => {
  const {
    data,
    isError,
    isLoading,
    refetch: refetchCreditAccount,
  } = useGetCreditAccountQuery();

  const { setSnackBar } = useContext(SnackBarContext);
  const { user: userFromToken } = useAuth();

  const removeCreditAccountUsersMutation =
    useRemoveCreditAccountUsersMutation();

  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
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
  const onClickRemoveButton = useCallback(() => {
    setIsRemoveDialogOpen(() => true);
  }, []);

  /**
   * Retrieves user identifiers based on their status from the row selection state.
   * @param {BCeIDUserStatusType} userStatus The status of the users to filter by.
   * @returns {string[]} An array of user identifiers (either user names or GUIDs)
   *                     based on the requested status.
   */
  const getSelectedUsers = useCallback(
    () => Object.keys(rowSelection).map((value: string) => value.split(",")[1]),
    [rowSelection],
  );

  /**
   * Function that removes one or more users.
   */
  const onConfirmRemove = async () => {
    setIsRemoveDialogOpen(() => false);
    const userClientNumbers: string[] = getSelectedUsers();
    if (userClientNumbers.length > 0) {
      await removeCreditAccountUsersMutation.mutateAsync(userClientNumbers);
    }
    setRowSelection(() => {
      return {};
    });
    refetchCreditAccount();
  };

  /**
   * Function that clears the delete related states when the user clicks on cancel.
   */
  const onCancelDelete = useCallback(() => {
    setIsRemoveDialogOpen(() => false);
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

  const table = useMaterialReactTable({
    ...defaultTableOptions,
    columns: CreditAccountUserColumnsDefinition,
    data: data?.users ?? [],
    initialState: {
      ...defaultTableInitialStateOptions,
    },
    state: {
      ...defaultTableStateOptions,
      showAlertBanner: isError,
      showProgressBars: isLoading,
      isLoading: isLoading,
      rowSelection: rowSelection,
    },
    enableGlobalFilter: false,
    renderEmptyRowsFallback: () => <NoRecordsFound />,
    enableRowSelection: (row: MRT_Row<CompanyProfile>): boolean => {
      if (
        row?.original?.companyGUID === userFromToken?.profile?.bceid_user_guid
      ) {
        return false;
      }
      return true;
    },
    onRowSelectionChange: setRowSelection,
    getRowId: (originalRow: CompanyProfile) => {
      return originalRow.companyGUID;
    },
    displayColumnDefOptions: {
      "mrt-row-actions": {
        header: "",
      },
      "mrt-row-select": {
        size: 1,
      },
    },
    renderToolbarInternalActions: useCallback(
      () => (
        <Box className="toolbar__inner">
          <Typography variant="h3" className="user-table__heading">
            Credit Account Users
          </Typography>
          <Button
            className="user-table__button user-table__button--remove"
            onClick={onClickRemoveButton}
            disabled={hasNoRowsSelected}
          >
            Remove User
          </Button>
        </Box>
      ),
      [hasNoRowsSelected],
    ),
    muiTablePaperProps: {
      className: "user-table__paper",
    },
    muiTableProps: {
      cellSpacing: 0,
    },
    muiTableContainerProps: {
      className: "user-table__container",
    },
    muiTopToolbarProps: {
      className: "user-table__toolbar",
    },
    muiTableHeadCellProps: {
      className: "user-table__cell",
    },
    muiTableBodyRowProps: ({ row }) => ({
      // backgroundColor: row.getIsSelected() ? "#d9eaf7" : "transparent",
      className: row.getIsSelected()
        ? "user-table__row user-table__row--selected"
        : "user-table__row",
    }),
    muiTableBodyCellProps: {
      className: "user-table__cell",
    },
    muiToolbarAlertBannerProps: isError
      ? {
          color: "error",
          children: "Error loading data",
        }
      : undefined,
    positionToolbarAlertBanner: "none",
    enableSorting: false,
  });

  return (
    <div className="user-table">
      <MaterialReactTable table={table} />
      <RemoveUserModal
        onClickRemove={onConfirmRemove}
        isOpen={isRemoveDialogOpen}
        onClickCancel={onCancelDelete}
      />
    </div>
  );
};
