import { Box, Typography } from "@mui/material";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useCallback } from "react";
import { NoRecordsFound } from "../../../../common/components/table/NoRecordsFound";
import {
  defaultTableInitialStateOptions,
  defaultTableOptions,
  defaultTableStateOptions,
} from "../../../../common/helpers/tableHelper";
import { getDefaultRequiredVal } from "../../../../common/helpers/util";
import { CompanyProfile } from "../../../manageProfile/types/manageProfile.d";
import { useGetCreditAccountHistoryQuery } from "../../hooks/creditAccount";
import {
  CREDIT_ACCOUNT_ACTIVITY_TYPE,
  CreditAccountActivity,
} from "../../types/creditAccount";
import { CreditAccountActivityColumnsDefinition } from "../../types/CreditAccountActivityColumns";
import "./ActivityTable.scss";

/**
 * Hold/Close activity history component for credit account.
 */
export const ActivityTable = ({
  companyId,
  creditAccountId,
}: {
  companyId: number;
  creditAccountId: number;
}) => {
  const {
    data: creditAccountActivities,
    isLoading,
    isError: fetchCreditAccountError,
  } = useGetCreditAccountHistoryQuery({ companyId, creditAccountId });

  const dataToBeShown = getDefaultRequiredVal([], creditAccountActivities)
    .filter(
      (activity: CreditAccountActivity) =>
        activity.creditAccountActivityType !==
        CREDIT_ACCOUNT_ACTIVITY_TYPE.OPENED,
    )
    .reverse();

  const table = useMaterialReactTable({
    ...defaultTableOptions,
    columns: CreditAccountActivityColumnsDefinition,
    data: dataToBeShown,
    initialState: {
      ...defaultTableInitialStateOptions,
    },
    state: {
      ...defaultTableStateOptions,
      showAlertBanner: fetchCreditAccountError,
      showProgressBars: isLoading,
      isLoading: isLoading,
    },
    layoutMode: "grid",
    defaultColumn: {},
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
          <Typography variant="h3" className="activity-table__heading">
            Account History
          </Typography>
        </Box>
      ),
      [],
    ),
    muiTablePaperProps: {
      className: "activity-table__paper",
    },
    muiTableProps: {
      cellSpacing: 0,
    },
    muiTableContainerProps: {
      className: "activity-table__container",
    },
    muiTopToolbarProps: {
      className: "activity-table__toolbar",
    },
    muiTableHeadProps: {
      className: "activity-table__head",
    },
    muiTableHeadCellProps: {
      className: "activity-table__cell",
    },
    muiTableBodyRowProps: {
      className: "activity-table__row",
    },
    muiTableBodyCellProps: {
      className: "activity-table__cell",
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
    <div>
      {dataToBeShown.length ? (
        <div className="activity-table">
          <MaterialReactTable table={table} />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
