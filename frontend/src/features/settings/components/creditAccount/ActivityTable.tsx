import { Box, Typography } from "@mui/material";
import { useCallback, useContext } from "react";
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
import { CreditAccountActivityColumnsDefinition } from "../../types/CreditAccountActivityColumns";
import { CompanyProfile } from "../../../manageProfile/types/manageProfile.d";
import { useGetCreditAccountQuery } from "../../hooks/creditAccount";
import { CreditAccountActivity } from "../../types/creditAccount";
import "./ActivityTable.scss";
import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import { getDefaultRequiredVal } from "../../../../common/helpers/util";

/**
 * Hold/Close activity history component for credit account.
 */
export const ActivityTable = () => {
  const { companyId } = useContext(OnRouteBCContext);
  const {
    data: creditAccount,
    isLoading,
    isError: fetchCreditAccountError,
  } = useGetCreditAccountQuery(getDefaultRequiredVal(0, companyId));

  const creditAccountActivities = getDefaultRequiredVal(
    [],
    creditAccount?.creditAccountActivities,
  )
    .filter(
      (activity: CreditAccountActivity) =>
        activity.creditAccountActivityType !== "OPENED",
    )
    .reverse();

  const table = useMaterialReactTable({
    ...defaultTableOptions,
    columns: CreditAccountActivityColumnsDefinition,
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
            Hold / Close History
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
      {creditAccountActivities.length ? (
        <div className="activity-table">
          <MaterialReactTable table={table} />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
