import { MRT_ColumnDef } from "material-react-table";
import { ApplicationInProgress } from "../../types/application";
import { Link } from "react-router-dom";

export const ActivePermitsColumnDefinition: MRT_ColumnDef<ApplicationInProgress>[] = [
  {
    accessorKey: "permitNumber",
    header: "Permit #",
    accessorFn: (row) => row.permitNumber,
    Cell: (props: {cell: any, row: any}) => {
      return <Link to={`/permits/${props.row.original.permitId}`}>{props.cell.getValue()}</Link>
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
    accessorKey: "permitData.vehicleDetails.plate",
    header: "Plate",
  },
  {
    accessorKey: "permitData.startDate",
    header: "Permit Start Date",
  },
  {
    accessorKey: "permitData.expiryDate",
    header: "Permit End Date",
  },
  {
    accessorKey: "permitData.contactDetails.firstName",
    header: "Applicant",
  }
];

export const PermitsNotFoundColumnDefinition: MRT_ColumnDef<ApplicationInProgress>[] = [
];