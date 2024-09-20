import { MRT_ColumnDef } from "material-react-table";
import { ApplicationListItem } from "../../types/application";
import { getPermitTypeName } from "../../types/PermitType";
import { Box, Tooltip } from "@mui/material";
import { CustomNavLink } from "../../../../common/components/links/CustomNavLink";
import { APPLICATIONS_ROUTES } from "../../../../routes/constants";
import { canUserAccessApplication } from "../../helpers/mappers";
import { useContext } from "react";
import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import { getDefaultNullableVal } from "../../../../common/helpers/util";

export const ApplicationInQueueColumnDefinition: MRT_ColumnDef<ApplicationListItem>[] =
  [
    {
      accessorKey: "applicationNumber",
      id: "applicationNumber",
      enableSorting: false,
      header: "Application #",
      accessorFn: (row) => row.applicationNumber,
      Cell: (props: { cell: any; row: any }) => {
        const permitIdStr = `${props.row.original.permitId}`;
        const { idirUserDetails, userDetails } = useContext(OnRouteBCContext);
        const userRole = getDefaultNullableVal(
          idirUserDetails?.userRole,
          userDetails?.userRole,
        );
        return canUserAccessApplication(
          props.row.original.permitApplicationOrigin,
          userRole,
        ) ? (
          <CustomNavLink
            to={`${APPLICATIONS_ROUTES.DETAILS(permitIdStr)}`}
            className="column-link column-link--application-details"
          >
            {props.cell.getValue()}
          </CustomNavLink>
        ) : (
          <>{props.cell.getValue()}</>
        );
      },
      minSize: 320,
    },
    {
      accessorKey: "permitType",
      id: "permitType",
      enableSorting: false,
      header: "Permit Type",
      Cell: (props: { cell: any }) => {
        const permitTypeName = getPermitTypeName(props.cell.getValue());
        return (
          <Tooltip title={permitTypeName}>
            <Box>{props.cell.getValue()}</Box>
          </Tooltip>
        );
      },
      size: 80,
    },
    {
      accessorKey: "plate",
      id: "plate",
      enableSorting: false,
      header: "Plate",
      size: 50,
    },
    {
      accessorKey: "startDate",
      id: "startDate",
      enableSorting: true,
      header: "Permit Start Date",
      size: 140,
    },
    {
      accessorKey: "timeInQueue",
      enableSorting: false,
      id: "timeInQueue",
      header: "Time in Queue (hh:mm)",
      size: 200,
    },
  ];
