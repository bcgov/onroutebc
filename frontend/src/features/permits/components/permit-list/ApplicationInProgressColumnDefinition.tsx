import { MRT_ColumnDef } from "material-react-table";
import { ApplicationInProgress } from "../../types/application";
import { APPLICATIONS_ROUTES } from "../../../../routes/constants";
import { CustomNavLink } from "../../../../common/components/links/CustomNavLink";

export const ApplicationInProgressColumnDefinition: MRT_ColumnDef<ApplicationInProgress>[] =
  [
    {
      accessorKey: "applicationNumber",
      id: "applicationNumber",
      enableSorting: false,
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
      id: "permitType",
      enableSorting: false,
      header: "Permit Type",
    },
    {
      accessorKey: "unitNumber",
      id: "unitNumber",
      enableSorting: false,
      header: "Unit #",
    },
    {
      accessorKey: "permitData.vehicleDetails.vin",
      id: "vin",
      enableSorting: false,
      header: "VIN",
    },
    {
      accessorKey: "permitData.vehicleDetails.plate",
      id: "plate",
      enableSorting: false,
      header: "Plate",
    },
    {
      accessorKey: "permitData.startDate",
      id: "startDate",
      enableSorting: false,
      header: "Permit Start Date",
    },
    {
      accessorKey: "updatedDateTime",
      enableSorting: false,
      id: "updatedDateTime",
      header: "Last Updated",
    },
    {
      accessorFn: (row) =>
        `${row.permitData.contactDetails?.firstName} ${row.permitData.contactDetails?.lastName} `,
      id: "applicant",
      header: "Applicant",
      enableSorting: false,
    },
  ];

export const ApplicationNotFoundColumnDefinition: MRT_ColumnDef<ApplicationInProgress>[] =
  [];
