/* eslint-disable @typescript-eslint/no-unused-vars */
import { MRT_ColumnDef } from "material-react-table";
import { ApplicationListItem } from "../../types/application";
import { getPermitTypeName } from "../../types/PermitType";
import { Box, Tooltip } from "@mui/material";
import { CustomNavLink } from "../../../../common/components/links/CustomNavLink";
import { APPLICATION_QUEUE_ROUTES } from "../../../../routes/constants";

export const getApplicationInQueueColumnDefinition = (
  handleFollowApplicationLink: (application: ApplicationListItem) => void,
): MRT_ColumnDef<ApplicationListItem>[] => [
  {
    accessorKey: "applicationNumber",
    id: "applicationNumber",
    enableSorting: false,
    header: "Application #",
    accessorFn: (row) => row.applicationNumber,
    Cell: (props: { cell: any; row: any }) => {
      const application = props.row.original;
      const applicationNumber = application.applicationNumber;
      return (
        <CustomNavLink
          onClick={(e) => {
            e.preventDefault();
            handleFollowApplicationLink(application);
          }}
          to={`${APPLICATION_QUEUE_ROUTES.REVIEW}/${applicationNumber}`}
          className="column-link column-link--application-details"
        >
          {props.cell.getValue()}
        </CustomNavLink>
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
