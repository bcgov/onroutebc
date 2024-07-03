import { MRT_ColumnDef } from "material-react-table";
import { CompanyProfile } from "../../../features/manageProfile/types/manageProfile";
import { UPDATE_STATUS_ACTIONS, UpdateStatusActionType } from "./creditAccount";

const getStatusCellValue = (activityType: UpdateStatusActionType) => {
  switch (activityType) {
    case UPDATE_STATUS_ACTIONS.HOLD_CREDIT_ACCOUNT:
      return "Account Held";
    case UPDATE_STATUS_ACTIONS.UNHOLD_CREDIT_ACCOUNT:
      return "Account Unheld";
    case UPDATE_STATUS_ACTIONS.CLOSE_CREDIT_ACCOUNT:
      return "Account Closed";
    case UPDATE_STATUS_ACTIONS.REOPEN_CREDIT_ACCOUNT:
      return "Account Reopened";
  }
};

/**
 * The column definition for credit account history table.
 */
export const CreditAccountHistoryColumnsDefinition: MRT_ColumnDef<CompanyProfile>[] =
  [
    {
      accessorKey: "IDIR",
      header: "IDIR",
    },
    {
      accessorKey: "activityDateTime",
      header: "Date",
    },
    {
      accessorKey: "reason",
      header: "Reason",
    },
    {
      accessorKey: "activityType",
      header: "Status",
      Cell: (props: { row: any }) => {
        return (
          <span className="cell__text">
            {getStatusCellValue(props.row.original.activityType)}
          </span>
        );
      },
    },
  ];
