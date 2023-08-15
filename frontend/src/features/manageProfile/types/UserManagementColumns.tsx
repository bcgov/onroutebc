import { MRT_ColumnDef } from "material-react-table";
import { BCeIDAuthGroup, ReadCompanyUser } from "./userManagement.d";
import { UserManagementChip } from "../components/user-management/UserManagementChip";
import { Stack } from "@mui/material";

/**
 * Translates the userAuthGroup code into a more meaningful text for the user.
 * @param userAuthGroup The userAuthGroup of the user
 * @returns A user-friendly text for the user auth group.
 */
const translateUserAuth = (userAuthGroup: BCeIDAuthGroup): string => {
  if (!userAuthGroup) return "";
  switch (userAuthGroup) {
    case BCeIDAuthGroup.CVCLIENT:
      return "Permit Applicant";
    default:
      return "Administrator";
  }
};

/**
 * A boolean indicating if a small badge has to be displayed beside the Permit Number.
 */
const shouldShowChip = (userStatus: string) => {
  return userStatus === "PENDING" || true;
};

/**
 * The column definition for User Management Table.
 */
export const UserManagementColumnsDefinition: MRT_ColumnDef<ReadCompanyUser>[] =
  [
    {
      accessorKey: "userName",
      header: "BCeID Username",
      Cell: (props: { row: any }) => {
        return (
          <>
            <Stack direction="row">
              <span>{props.row.original.userName}</span>
              {shouldShowChip(props.row.original.userStatus) && (
                <UserManagementChip />
              )}
            </Stack>
          </>
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
      accessorKey: "userAuthGroup",
      header: "User Group",
      Cell: (props: { cell: any }) => {
        return <>{translateUserAuth(props.cell.getValue())}</>;
      },
    },
  ];
