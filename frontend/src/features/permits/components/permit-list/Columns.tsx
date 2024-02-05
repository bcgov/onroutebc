import { MRT_ColumnDef } from "material-react-table";

import { formatCellValuetoDatetime } from "../../../../common/helpers/tableHelper";
import { Permit } from "../../types/permit";

/**
 * The column definition for Permits.
 */
export const PermitsColumnDefinition: MRT_ColumnDef<Permit>[] = [
  
  {
    accessorKey: "permitType",
    id: "permitType",
    header: "Permit Type",
    enableSorting: true,
  },
  {
    accessorFn: (row) => `${row.permitData.vehicleDetails?.unitNumber ?? ""}`,
    id: "unitNumber",
    header: "Unit #",
    enableSorting: true,
  },
  {
    accessorKey: "permitData.vehicleDetails.plate",
    header: "Plate",
    id: "plate",
    enableSorting: true,
  },
  {
    accessorKey: "permitData.startDate",
    id: "startDate",
    header: "Permit Start Date",
    enableSorting: true,
    Cell: (props: { cell: any }) => {
      const formattedDate = formatCellValuetoDatetime(props.cell.getValue());
      return formattedDate;
    },
  },
  {
    accessorKey: "permitData.expiryDate",
    header: "Permit End Date",
    id: "expiryDate",
    enableSorting: true,
    Cell: (props: { cell: any }) => {
      const formattedDate = formatCellValuetoDatetime(props.cell.getValue());
      return formattedDate;
    },
  },
  {
    accessorFn: (row) =>
      `${row.permitData.contactDetails?.firstName} ${row.permitData.contactDetails?.lastName} `,
    id: "applicant",
    header: "Applicant",
    enableSorting: true,
  },
];

export const PermitsNotFoundColumnDefinition: MRT_ColumnDef<Permit>[] =
  PermitsColumnDefinition;
