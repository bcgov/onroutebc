import { Box, Typography } from "@mui/material";
import { useCallback, useContext, useEffect } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

import { SnackBarContext } from "../../../../App";
import { NoRecordsFound } from "../../../../common/components/table/NoRecordsFound";
import {
  defaultTableInitialStateOptions,
  defaultTableOptions,
  defaultTableStateOptions,
} from "../../../../common/helpers/tableHelper";
import { useCreditAccountHistoryQuery } from "../../hooks/creditAccount";
import { CreditAccountHistoryColumnsDefinition } from "../../types/CreditAccountHistoryColumns";
import { CompanyProfile } from "../../../manageProfile/types/manageProfile.d";
import "./HistoryTable.scss";

/**
 * Hold/Close history component for credit account.
 */
export const HistoryTable = () => {
  const {
    data: creditAccountHistory,
    isLoading,
    isError: fetchCreditAccountHistoryError,
    // refetch: refetchCreditAccountHistory,
  } = useCreditAccountHistoryQuery();

  const { setSnackBar } = useContext(SnackBarContext);

  useEffect(() => {
    if (fetchCreditAccountHistoryError) {
      setSnackBar({
        message: "An unexpected error occurred.",
        showSnackbar: true,
        setShowSnackbar: () => true,
        alertType: "error",
      });
    }
  }, [fetchCreditAccountHistoryError]);

  const table = useMaterialReactTable({
    ...defaultTableOptions,
    columns: CreditAccountHistoryColumnsDefinition,
    data: creditAccountHistory ?? [],
    initialState: {
      ...defaultTableInitialStateOptions,
    },
    state: {
      ...defaultTableStateOptions,
      showAlertBanner: fetchCreditAccountHistoryError,
      showProgressBars: isLoading,
      isLoading: isLoading,
    },
    enableGlobalFilter: false,
    renderEmptyRowsFallback: () => <NoRecordsFound />,
    enableRowSelection: false,
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
          <Typography variant="h3" className="history-table__heading">
            Hold / Close History
          </Typography>
        </Box>
      ),
      [],
    ),
    muiTablePaperProps: {
      className: "history-table__paper",
    },
    muiTableProps: {
      cellSpacing: 0,
    },
    muiTableContainerProps: {
      className: "history-table__container",
    },
    muiTopToolbarProps: {
      className: "history-table__toolbar",
    },
    muiTableHeadProps: {
      className: "history-table__head",
    },
    muiTableHeadCellProps: {
      className: "history-table__cell",
    },
    muiTableBodyRowProps: {
      className: "history-table__row",
    },
    muiTableBodyCellProps: {
      className: "history-table__cell",
    },
    muiToolbarAlertBannerProps: fetchCreditAccountHistoryError
      ? {
          color: "error",
          children: "Error loading data",
        }
      : undefined,
    positionToolbarAlertBanner: "none",
    enableSorting: false,
  });

  return (
    <div className="history-table">
      <MaterialReactTable table={table} />
    </div>
  );
};
