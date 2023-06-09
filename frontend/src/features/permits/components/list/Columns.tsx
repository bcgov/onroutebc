import { MRT_ColumnDef } from "material-react-table";
import { ApplicationInProgress } from "../../types/application";
import { Link } from "react-router-dom";

export const ApplicationInProgressColumnDefinition: MRT_ColumnDef<ApplicationInProgress>[] = [
  {
    accessorKey: "applicationNumber",
    header: "Application #",
    accessorFn: (row) => row.applicationNumber,
    Cell: (props: {cell: any, row: any}) => {
      return <Link to={`/applications/${props.row.original.permitId}`}>{props.cell.getValue()}</Link>
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
  }
];

export const ApplicationNotFoundColumnDefinition: MRT_ColumnDef<ApplicationInProgress>[] = [
];