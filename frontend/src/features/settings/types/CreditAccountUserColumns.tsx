import { Stack } from "@mui/material";
import { MRT_ColumnDef } from "material-react-table";
import { CompanyProfile } from "../../../features/manageProfile/types/manageProfile";

/**
 * The column definition for User Management Table.
 */
export const CreditAccountUserColumnsDefinition: MRT_ColumnDef<CompanyProfile>[] =
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
  ];
