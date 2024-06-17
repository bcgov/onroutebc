import { MRT_ColumnDef } from "material-react-table";
import { CompanyProfile } from "../../../features/manageProfile/types/manageProfile";
import {
  CloseActivityType,
  HoldActivityType,
  HOLD_ACTIVITY_TYPES,
  CLOSE_ACTIVITY_TYPES,
} from "./creditAccount";

const getStatusCellValue = (
  activityType: HoldActivityType | CloseActivityType,
) => {
  switch (activityType) {
    case HOLD_ACTIVITY_TYPES.HOLD_CREDIT_ACCOUNT:
      return "Account Held";
    case HOLD_ACTIVITY_TYPES.UNHOLD_CREDIT_ACCOUNT:
      return "Account Unheld";
    case CLOSE_ACTIVITY_TYPES.CLOSE_CREDIT_ACCOUNT:
      return "Account Closed";
    case CLOSE_ACTIVITY_TYPES.REOPEN_CREDIT_ACCOUNT:
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
