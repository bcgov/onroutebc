import Link from "@mui/material/Link";
import { MRT_ColumnDef } from "material-react-table";
import { viewPermitPdf } from "../../helpers/permitPDFHelper";
import { Permit } from "../../types/permit";
import { PermitChip } from "./PermitChip";

/**
 * The column definition for Permits.
 */
export const PermitsColumnDefinition: MRT_ColumnDef<Permit>[] = [
  {
    accessorKey: "permitNumber",
    header: "Permit #",
    enableSorting: false,
    size: 500,
    accessorFn: (row) => row.permitNumber,
    Cell: (props: { cell: any; row: any }) => {
      return (
        <>
          <Link
            component="button"
            variant="body2"
            onClick={() => viewPermitPdf(props.row.original.permitId)}
          >
            {props.cell.getValue()}
          </Link>
          <PermitChip permitStatus={props.row.original.permitStatus} />
        </>
      );
    },
  },
  {
    accessorKey: "permitType",
    header: "Permit Type",
    enableSorting: false,
  },
  {
    accessorFn: (row) => `${row.permitData.vehicleDetails?.unitNumber || ""}`,
    id: "unitNumber",
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
    accessorFn: (row) =>
      `${row.permitData.contactDetails?.firstName} ${row.permitData.contactDetails?.lastName} `,
    id: "application",
    header: "Applicant",
    enableSorting: false,
  },
];

export const PermitsNotFoundColumnDefinition: MRT_ColumnDef<Permit>[] =
  PermitsColumnDefinition;
