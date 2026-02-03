import { Stack } from "@mui/material";
import { MRT_ColumnDef, MRT_Row } from "material-react-table";
import { CREDIT_ACCOUNT_USER_TYPE, CreditAccountUser } from "./creditAccount";

/**
 * The column definition for User Management Table.
 */
export const CreditAccountUserColumnsDefinition: MRT_ColumnDef<CreditAccountUser>[] =
  [
    {
      accessorKey: "legalName",
      header: "Client Name",
      grow: true,
      Cell: (props: { row: MRT_Row<CreditAccountUser> }) => {
        return (
          <Stack direction="column" className="cell__stack">
            <span className="cell__text">{props.row.original.legalName}</span>
            {props.row.original.alternateName && (
              <>
                <span className="cell__text cell__text--bold">
                  Doing Business As (DBA)
                </span>
                <span className="cell__text">
                  {props.row.original.alternateName}
                </span>
              </>
            )}
          </Stack>
        );
      },
    },
    {
      accessorKey: "clientNumber",
      header: "onRouteBC Client No.",
      grow: false,
    },
    {
      accessorKey: "userType",
      header: "",
      grow: false,
      Cell: (props: { row: MRT_Row<CreditAccountUser> }) => {
        return (
          <>
            {props.row.original.userType ===
              CREDIT_ACCOUNT_USER_TYPE.HOLDER && (
              <span className="cell__text">Account Holder</span>
            )}
          </>
        );
      },
    },
  ];
