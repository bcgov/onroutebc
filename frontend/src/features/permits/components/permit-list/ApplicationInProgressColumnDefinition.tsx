import { MRT_ColumnDef } from "material-react-table";
import { ApplicationInProgress } from "../../types/application";
import { APPLICATIONS_ROUTES } from "../../../../routes/constants";
import { CustomNavLink } from "../../../../common/components/links/CustomNavLink";

export const ApplicationInProgressColumnDefinition: MRT_ColumnDef<ApplicationInProgress>[] =
  [
    {
      accessorKey: "applicationNumber",
      header: "Application #",
      accessorFn: (row) => row.applicationNumber,
      Cell: (props: { cell: any; row: any }) => {
        const permitIdStr = `${props.row.original.permitId}`;
        return (
          <CustomNavLink
            to={`${APPLICATIONS_ROUTES.DETAILS(permitIdStr)}`}
            className="column-link column-link--application-details"
          >
            {props.cell.getValue()}
          </CustomNavLink>
        );
      },
    },
    {
      accessorKey: "permitType",
      header: "Permit Type",
    },
    {
      accessorKey: "permitData.vehicleDetails.unitNumber",
      header: "Unit #",
    },
    {
      accessorKey: "permitData.vehicleDetails.vin",
      header: "VIN",
    },
    {
      accessorKey: "permitData.vehicleDetails.plate",
      header: "Plate",
    },
    {
      accessorKey: "permitData.startDate",
      header: "Permit Start Date",
    },
    {
      accessorKey: "updatedDateTime",
      header: "Last Updated",
    },
  ];

export const ApplicationNotFoundColumnDefinition: MRT_ColumnDef<ApplicationInProgress>[] =
  [];
