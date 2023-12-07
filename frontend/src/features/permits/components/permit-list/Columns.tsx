import Link from "@mui/material/Link";
import { MRT_ColumnDef } from "material-react-table";
import { viewPermitPdf } from "../../helpers/permitPDFHelper";
import { Permit } from "../../types/permit";
import { PermitChip } from "./PermitChip";
import { dateTimeStringSortingFn } from "../../../../common/constants/defaultTableOptions";

/**
 * The column definition for Permits.
 */
export const PermitsColumnDefinition: MRT_ColumnDef<Permit>[] = [
  {
    accessorKey: "permitNumber",
    header: "Permit #",
    enableSorting: true,
    sortingFn: "alphanumeric",
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
    enableSorting: true,
    sortingFn: "alphanumeric",
  },
  {
    accessorFn: (row) => `${row.permitData.vehicleDetails?.unitNumber || ""}`,
    id: "unitNumber",
    header: "Unit #",
    enableSorting: true,
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "permitData.vehicleDetails.plate",
    header: "Plate",
    enableSorting: true,
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "permitData.startDate",
    header: "Permit Start Date",
    enableSorting: true,
    sortingFn: dateTimeStringSortingFn,
  },
  {
    accessorKey: "permitData.expiryDate",
    header: "Permit End Date",
    enableSorting: true,
    sortingFn: dateTimeStringSortingFn,
  },
  {
    accessorFn: (row) =>
      `${row.permitData.contactDetails?.firstName} ${row.permitData.contactDetails?.lastName} `,
    id: "application",
    header: "Applicant",
    enableSorting: true,
    sortingFn: "alphanumericCaseSensitive",
  },
];

export const PermitsNotFoundColumnDefinition: MRT_ColumnDef<Permit>[] =
  PermitsColumnDefinition;
