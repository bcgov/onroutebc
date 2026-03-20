import { Stack } from "@mui/material";
import { MRT_ColumnDef } from "material-react-table";
import { DATE_FORMATS, toLocal } from "../../../common/helpers/formatDate";
import { getLabelForBCeIDUserRole } from "../../../common/helpers/util";
import { UserManagementChip } from "../components/user-management/UserManagementChip";
import { ReadUserInformationResponse } from "./manageProfile";

/**
 * A boolean indicating if a small badge has to be displayed beside the Permit Number.
 */
const shouldShowChip = (userStatus: string) => {
  return userStatus === "PENDING";
};

/**
 * The column definition for User Management Table.
 */
export const UserManagementColumnsDefinition: MRT_ColumnDef<ReadUserInformationResponse>[] =
  [
    {
      accessorKey: "userName",
      header: "BCeID Username",
      Cell: (props: { row: any }) => {
        return (
          <Stack direction="row">
            <span>{props.row.original.userName}</span>
            {shouldShowChip(props.row.original.statusCode) && (
              <UserManagementChip />
            )}
          </Stack>
        );
      },
    },
    {
      accessorKey: "firstName",
      header: "First Name",
    },
    {
      accessorKey: "lastName",
      header: "Last Name",
    },
    {
      accessorKey: "userRole",
      header: "User Group",
      Cell: (props: { cell: any }) => {
        return <>{getLabelForBCeIDUserRole(props.cell.getValue())}</>;
      },
    },
    {
      accessorKey: "createdDateTime",
      header: "Date Created",
      Cell: (props: { cell: any }) => {
        return (
          <>
            {toLocal(props.cell.getValue(), DATE_FORMATS.DATEONLY_SHORT_NAME)}
          </>
        );
      },
    },
  ];
