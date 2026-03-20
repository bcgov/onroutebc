import { MRT_ColumnDef, MRT_Row } from "material-react-table";
import {
  CreditAccountActivity,
  CreditAccountActivityDisplayValues,
} from "./creditAccount";
import { toLocal, DATE_FORMATS } from "../../../common/helpers/formatDate";

/**
 * The column definition for credit account activity history table.
 */
export const CreditAccountActivityColumnsDefinition: MRT_ColumnDef<CreditAccountActivity>[] =
  [
    {
      accessorKey: "userName",
      header: "IDIR",
      size: 0,
    },
    {
      accessorKey: "creditAccountActivityDateTime",
      header: "Date",
      grow: false,
      minSize: 220,
      Cell: (props: { row: MRT_Row<CreditAccountActivity> }) => {
        return (
          <>
            {toLocal(
              props.row.original.creditAccountActivityDateTime,
              DATE_FORMATS.LONG,
            )}
          </>
        );
      },
    },
    {
      accessorKey: "comment",
      header: "Reason",
      grow: true,
    },
    {
      accessorKey: "creditAccountActivityType",
      header: "Action",
      grow: false,
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
