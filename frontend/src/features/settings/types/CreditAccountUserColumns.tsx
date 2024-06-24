import { Stack } from "@mui/material";
import { MRT_ColumnDef, MRT_Row } from "material-react-table";
import { CreditAccountUser } from "./creditAccount";

/**
 * The column definition for User Management Table.
 */
export const CreditAccountUserColumnsDefinition: MRT_ColumnDef<CreditAccountUser>[] =
  [
    {
      accessorKey: "legalName",
      header: "Company Name",
      Cell: (props: { row: any }) => {
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
    },
    {
      accessorKey: "userType",
      header: "",
      Cell: (props: { row: MRT_Row<CreditAccountUser> }) => {
        return (
          <>
            {props.row.original.userType === "HOLDER" && (
              <span className="cell__text">Account Holder</span>
            )}
          </>
        );
      },
    },
  ];
