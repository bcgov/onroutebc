import { Box, Button, Typography } from "@mui/material";
import { RowSelectionState } from "@tanstack/table-core";
import {
  MRT_Row,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useCallback, useEffect, useState } from "react";
import { NoRecordsFound } from "../../../../common/components/table/NoRecordsFound";
import {
  defaultTableInitialStateOptions,
  defaultTableOptions,
  defaultTableStateOptions,
} from "../../../../common/helpers/tableHelper";
import { useGetCreditAccountUsersQuery } from "../../hooks/creditAccount";
import {
  CREDIT_ACCOUNT_USER_TYPE,
  CreditAccountMetadata,
  CreditAccountUser,
} from "../../types/creditAccount";
import { CreditAccountUserColumnsDefinition } from "../../types/CreditAccountUserColumns";
import { RemoveUsersModal } from "./RemoveUsersModal";
import "./UserTable.scss";
import { usePermissionMatrix } from "../../../../common/authentication/PermissionMatrix";

/**
 * User Management Component for Credit Accounts.
 */
export const UserTable = ({
  companyId,
  creditAccountMetadata: { userType, creditAccountId },
}: {
  companyId: number;
  creditAccountMetadata: CreditAccountMetadata;
}) => {
  const {
    data: creditAccountUsers,
    isError,
    isLoading,
    refetch,
  } = useGetCreditAccountUsersQuery({ companyId, creditAccountId });

  const accountHolder = creditAccountUsers?.find(
    (user) => user.userType === CREDIT_ACCOUNT_USER_TYPE.HOLDER,
  );

  const isAccountHolder = userType === CREDIT_ACCOUNT_USER_TYPE.HOLDER;

  const canUserUpdateCreditAccount = usePermissionMatrix({
    permissionMatrixKeys: {
      permissionMatrixFeatureKey: "MANAGE_SETTINGS",
      permissionMatrixFunctionKey:
        "PERFORM_CREDIT_ACCOUNT_DETAIL_ACTIONS_ACCOUNT_HOLDER",
    },
    additionalConditionToCheck: () => isAccountHolder,
  });

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

  let dataToBeShown: CreditAccountUser[] = [];
  if (creditAccountUsers) {
    if (isAccountHolder) {
      dataToBeShown = creditAccountUsers;
    } else if (accountHolder) {
      dataToBeShown = [accountHolder];
    }
  }

  const table = useMaterialReactTable({
    ...defaultTableOptions,
    columns: CreditAccountUserColumnsDefinition,
    data: dataToBeShown,
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
    enableRowSelection: canUserUpdateCreditAccount
      ? ({ original: { userType } }: MRT_Row<CreditAccountUser>): boolean => {
          return userType !== CREDIT_ACCOUNT_USER_TYPE.HOLDER;
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
          {canUserUpdateCreditAccount && (
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
      [canUserUpdateCreditAccount, handleRemoveButton, hasNoRowsSelected],
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
