import { MRT_ColumnDef } from "material-react-table";
import { ApplicationInProgress, PermitApplicationInProgress } from "../../types/application";
import { Link } from "react-router-dom";

export const ActivePermitsColumnDefinition: MRT_ColumnDef<PermitApplicationInProgress>[] = [
  {
    accessorKey: "permitNumber",
    header: "Permit #",
    enableSorting: false,
    size: 500,
    accessorFn: (row) => row.permitNumber,
    Cell: (props: {cell: any, row: any}) => {
      return <Link to={`/permits/${props.row.original.permitId}`}>{props.cell.getValue()}</Link>
    },

  },
  {
    accessorKey: "permitType",
    header: "Permit Type",
    enableSorting: false,
  },
  {
    accessorKey: "permitData.vehicleDetails.unitNumber",
    header: "Unit #",
    enableSorting: false,
  },
  {
    accessorKey: "permitData.vehicleDetails.plate",
    header: "Plate",
    enableSorting: false,
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
    // accessorKey: "permitData.contactDetails.firstName",
    accessorFn: (row) => `${row.permitData.contactDetails?.firstName} ${row.permitData.contactDetails?.lastName} `,
    id: "application",
    header: "Applicant",
    enableSorting: false,
  }
];

export const PermitsNotFoundColumnDefinition: MRT_ColumnDef<PermitApplicationInProgress>[] = [
];