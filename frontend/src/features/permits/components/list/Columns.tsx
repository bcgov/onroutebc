import { MRT_ColumnDef } from "material-react-table";

import { ApplicationListItem } from "../../types/application";
import { APPLICATIONS_ROUTES } from "../../../../routes/constants";
import { CustomNavLink } from "../../../../common/components/links/CustomNavLink";

export const ApplicationInProgressColumnDefinition: MRT_ColumnDef<ApplicationListItem>[] =
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
      accessorKey: "unitNumber",
      header: "Unit #",
    },
    {
      accessorKey: "vin",
      header: "VIN",
    },
    {
      accessorKey: "plate",
      header: "Plate",
    },
    {
      accessorKey: "startDate",
      header: "Permit Start Date",
    },
    {
      accessorKey: "updatedDateTime",
      header: "Last Updated",
    },
  ];

export const ApplicationNotFoundColumnDefinition: MRT_ColumnDef<ApplicationListItem>[] =
  [];
