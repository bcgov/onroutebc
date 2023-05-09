import { MRT_ColumnDef } from "material-react-table";
import { ApplicationInProgress } from "../../types/application";
import { Link } from "react-router-dom";

export const ApplicationInProgressColumnDefinition: MRT_ColumnDef<ApplicationInProgress>[] = [
  {
    accessorKey: "applicationNumber",
    header: "Application #",
    Cell: (props: {cell: any}) => <Link to="#">{props.cell.getValue()}</Link>
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
    accessorKey: "startDate",
    header: "Permit Start Date",
  },
  {
    accessorKey: "updatedDateTime",
    header: "Last Updated",
  }
];