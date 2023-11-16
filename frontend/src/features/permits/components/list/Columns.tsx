import { MRT_ColumnDef } from "material-react-table";
import { Link } from "react-router-dom";

import { ApplicationInProgress } from "../../types/application";
import { APPLICATIONS_ROUTES } from "../../../../routes/constants";

export const ApplicationInProgressColumnDefinition: MRT_ColumnDef<ApplicationInProgress>[] =
  [
    {
      accessorKey: "applicationNumber",
      header: "Application #",
      accessorFn: (row) => row.applicationNumber,
      Cell: (props: {cell: any, row: any}) => {
        return (
          <Link 
            to={`${APPLICATIONS_ROUTES.BASE}/${props.row.original.permitId}`}
            className="column-link column-link--application-details"
          >
            {props.cell.getValue()}
          </Link>
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
