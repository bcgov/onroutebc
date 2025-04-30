import { Box, Tooltip } from "@mui/material";
import { MRT_ColumnDef } from "material-react-table";
import { CustomNavLink } from "../../../common/components/links/CustomNavLink";
import { APPLICATION_QUEUE_ROUTES } from "../../../routes/constants";
import { ApplicationListItem } from "../../permits/types/application";
import { getPermitTypeName } from "../../permits/types/PermitType";
import { convertTimeStrToSeconds } from "../../../common/helpers/formatDate";

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
      const permitId = application.permitId;
      const companyId = application.companyId;
      return (
        <CustomNavLink
          onClick={(e) => {
            e.preventDefault();
            handleFollowApplicationLink(application);
          }}
          to={APPLICATION_QUEUE_ROUTES.REVIEW(companyId, permitId)}
          className="column-link column-link--application-details"
        >
          {props.cell.getValue()}
        </CustomNavLink>
      );
    },
    size: 200,
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
    accessorKey: "legalName",
    id: "legalName",
    enableSorting: false,
    header: "Company Name",
    size: 200,
  },
  {
    accessorKey: "startDate",
    id: "startDate",
    enableSorting: false,
    header: "Permit Start Date",
    size: 140,
  },
  {
    accessorKey: "timeInQueue",
    enableSorting: true,
    id: "timeInQueue",
    header: "Time in Queue (hh:mm)",
    size: 200,
    sortingFn: (rowA, rowB) => {
      const timeA = convertTimeStrToSeconds(rowA?.original?.timeInQueue);
      const timeB = convertTimeStrToSeconds(rowB?.original?.timeInQueue);
      // Sort in descending order (larger times come first)
      return timeB - timeA;
    },
  },
];
