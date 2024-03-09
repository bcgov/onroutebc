import { MRT_ColumnDef } from "material-react-table";
import { ApplicationListItem } from "../../types/application";
import { APPLICATIONS_ROUTES } from "../../../../routes/constants";
import { CustomNavLink } from "../../../../common/components/links/CustomNavLink";

export const ApplicationInProgressColumnDefinition: MRT_ColumnDef<ApplicationListItem>[] =
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
      accessorKey: "vin",
      id: "vin",
      enableSorting: false,
      header: "VIN",
    },
    {
      accessorKey: "plate",
      id: "plate",
      enableSorting: false,
      header: "Plate",
    },
    {
      accessorKey: "startDate",
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
      accessorKey: "applicant",
      id: "applicant",
      header: "Applicant",
      enableSorting: false,
    },
  ];

export const ApplicationNotFoundColumnDefinition: MRT_ColumnDef<ApplicationListItem>[] =
  [];
