import { Box, Typography } from "@mui/material";
import { useCallback } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { NoRecordsFound } from "../../../../common/components/table/NoRecordsFound";
import {
  defaultTableInitialStateOptions,
  defaultTableOptions,
  defaultTableStateOptions,
} from "../../../../common/helpers/tableHelper";
import { CreditAccountHistoryColumnsDefinition } from "../../types/CreditAccountHistoryColumns";
import { CompanyProfile } from "../../../manageProfile/types/manageProfile.d";
import "./HistoryTable.scss";
import { useGetCreditAccountQuery } from "../../hooks/creditAccount";

/**
 * Hold/Close history component for credit account.
 */
export const HistoryTable = () => {
  const {
    data: creditAccount,
    isLoading,
    isError: fetchCreditAccountError,
  } = useGetCreditAccountQuery();

  const creditAccountActivities = [
    ...(creditAccount?.creditAccountActivities ?? []),
  ].reverse();

  const table = useMaterialReactTable({
    ...defaultTableOptions,
    columns: CreditAccountHistoryColumnsDefinition,
    data: creditAccountActivities ?? [],
    initialState: {
      ...defaultTableInitialStateOptions,
    },
    state: {
      ...defaultTableStateOptions,
      showAlertBanner: fetchCreditAccountError,
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
    muiToolbarAlertBannerProps: fetchCreditAccountError
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
