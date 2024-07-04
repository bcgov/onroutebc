import { MRT_ColumnDef, MRT_Row } from "material-react-table";
import {
  CreditAccountActivity,
  CreditAccountActivityDisplayValues,
} from "./creditAccount";

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/Los_Angeles", // PDT time zone
    timeZoneName: "short",
  };

  return date.toLocaleString("en-US", options);
};

/**
 * The column definition for credit account history table.
 */
export const CreditAccountHistoryColumnsDefinition: MRT_ColumnDef<CreditAccountActivity>[] =
  [
    {
      accessorKey: "userName",
      header: "IDIR",
    },
    {
      accessorKey: "creditAccountActivityDateTime",
      header: "Date",
      Cell: (props: { row: any }) => {
        return (
          <span>
            {formatDate(props.row.original.creditAccountActivityDateTime)}
          </span>
        );
      },
    },
    {
      accessorKey: "comment",
      header: "Reason",
    },
    {
      accessorKey: "creditAccountActivityType",
      header: "Status",
      Cell: (props: { row: MRT_Row<CreditAccountActivity> }) => {
        return (
          <span className="cell__text">
            {
              CreditAccountActivityDisplayValues[
                props.row.original.creditAccountActivityType
              ]
            }
          </span>
        );
      },
    },
  ];
