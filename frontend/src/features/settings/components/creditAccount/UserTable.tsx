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
import { CreditAccountUserColumnsDefinition } from "../../types/CreditAccountUserColumns";
import { canUpdateCreditAccount } from "../../helpers/permissions";
import {
  CREDIT_ACCOUNT_USER_TYPE,
  CreditAccountUser,
} from "../../types/creditAccount";
import { useGetCreditAccountQuery } from "../../hooks/creditAccount";
import "./UserTable.scss";
import { getDefaultRequiredVal } from "../../../../common/helpers/util";

/**
 * User Management Component for Credit Accounts.
 */
export const UserTable = () => {
  const { userRoles, companyId } = useContext(OnRouteBCContext);

  const {
    data: creditAccount,
    isError,
    isLoading,
    refetch,
  } = useGetCreditAccountQuery(getDefaultRequiredVal(0, companyId));

  const creditAccountUsers = creditAccount?.creditAccountUsers;

  const accountHolder = creditAccountUsers?.find(
    (user) => user.userType === CREDIT_ACCOUNT_USER_TYPE.HOLDER,
  );

  const isAccountHolder = companyId === accountHolder?.companyId;

  const showCheckboxes = canUpdateCreditAccount(userRoles) && isAccountHolder;
  const showRemoveUserButton = canUpdateCreditAccount(userRoles);

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
    data: isAccountHolder ? creditAccountUsers : [accountHolder],
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
    layoutMode: "grid",
    defaultColumn: {},
    enableGlobalFilter: false,
    renderEmptyRowsFallback: () => <NoRecordsFound />,
    enableRowSelection: showCheckboxes
      ? (row: MRT_Row<CreditAccountUser>): boolean => {
          return row?.original?.userType !== CREDIT_ACCOUNT_USER_TYPE.HOLDER;
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
          {showRemoveUserButton && (
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
      [showRemoveUserButton, handleRemoveButton, hasNoRowsSelected],
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
