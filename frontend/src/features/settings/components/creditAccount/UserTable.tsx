import { Box, Button, Typography } from "@mui/material";
import { RowSelectionState } from "@tanstack/table-core";
import { useCallback, useContext, useEffect, useState } from "react";
import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import {
  MRT_Row,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { RemoveUsersModal } from "./RemoveUsersModal";
import { NoRecordsFound } from "../../../../common/components/table/NoRecordsFound";
import {
  defaultTableInitialStateOptions,
  defaultTableOptions,
  defaultTableStateOptions,
} from "../../../../common/helpers/tableHelper";
import { useGetCreditAccountWithUsersQuery } from "../../hooks/creditAccount";
import { CreditAccountUserColumnsDefinition } from "../../types/CreditAccountUserColumns";
import { canUpdateCreditAccount } from "../../helpers/permissions";
import { CreditAccountUser } from "../../types/creditAccount";
import "./UserTable.scss";

/**
 * User Management Component for Credit Accounts.
 */
export const UserTable = () => {
  const {
    creditAccountUsers: {
      data: creditAccountUsers,
      isError,
      isLoading,
      refetch,
    },
  } = useGetCreditAccountWithUsersQuery();

  const { userRoles } = useContext(OnRouteBCContext);

  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [userIds, setUserIds] = useState<number[]>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const hasNoRowsSelected = Object.keys(rowSelection).length === 0;

  /**
   * Callback function for clicking on the 'remove user' button above the Table.
   */
  const handleRemoveButton = useCallback(() => {
    setIsRemoveModalOpen(() => true);
  }, []);

  /**
   * Retrieves user identifiers from the row selection state.
   */
  const getSelectedUsers = useCallback(() => {
    return Object.keys(rowSelection).map((value: string) => Number(value));
  }, [rowSelection]);

  /**
   * Close RemoveUserModal and clear row selection state
   */
  const handleConfirmRemove = async () => {
    setIsRemoveModalOpen(() => false);
    setRowSelection(() => {
      return {};
    });
    refetch();
  };

  /**
   * Function that clears the delete related states when the user clicks on cancel.
   */
  const handleCancelRemove = useCallback(() => {
    setIsRemoveModalOpen(() => false);
    setRowSelection(() => {
      return {};
    });
  }, []);

  useEffect(() => {
    setUserIds(getSelectedUsers());
  }, [rowSelection]);

  const table = useMaterialReactTable({
    ...defaultTableOptions,
    columns: CreditAccountUserColumnsDefinition,
    data: creditAccountUsers ?? [],
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
    enableRowSelection: canUpdateCreditAccount(userRoles)
      ? (row: MRT_Row<CreditAccountUser>): boolean => {
          if (row?.original?.userType === "HOLDER") {
            return false;
          }
          return true;
        }
      : false,
    onRowSelectionChange: setRowSelection,
    getRowId: (originalRow: CreditAccountUser) => {
      return originalRow.companyId;
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
          {canUpdateCreditAccount(userRoles) && (
            <Button
              className="user-table__button user-table__button--remove"
              onClick={handleRemoveButton}
              disabled={hasNoRowsSelected}
            >
              Remove User
            </Button>
          )}
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
    muiTableHeadProps: {
      className: "user-table__head",
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
    muiSelectCheckboxProps: {
      className: "user-table__checkbox",
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
      <RemoveUsersModal
        isOpen={isRemoveModalOpen}
        onCancel={handleCancelRemove}
        onConfirm={handleConfirmRemove}
        userIds={userIds}
      />
    </div>
  );
};
