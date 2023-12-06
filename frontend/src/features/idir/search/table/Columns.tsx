import { Link } from "@mui/material";
import { MRT_ColumnDef } from "material-react-table";

import { Permit } from "../../../permits/types/permit";
import { PERMIT_EXPIRED } from "../../../permits/types/PermitStatus";
import { PermitChip } from "../../../permits/components/permit-list/PermitChip";
import {
  hasPermitExpired,
  viewPermitPdf,
} from "../../../permits/helpers/permitPDFHelper";
import {
  dateTimeStringSortingFn,
  formatCellValuetoDatetime,
} from "../../../../common/constants/defaultTableOptions";

/*
 *
 * The Columns Options are from Material React Table.
 * For a list of options, see here:
 * https://www.material-react-table.com/docs/api/column-options
 *
 */
export const PermitSearchResultColumnDef: MRT_ColumnDef<Permit>[] = [
  {
    accessorKey: "permitNumber",
    header: "Permit #",
    enableSorting: true,
    sortingFn: "alphanumeric",
    Cell: (props: { cell: any; row: any }) => {
      const permit = props.row.original as Permit;
      const {
        permitId,
        permitStatus,
        permitData: { expiryDate },
      } = permit;

      return (
        <>
          <Link
            component="button"
            variant="body2"
            onClick={() => viewPermitPdf(permitId.toString())}
          >
            {props.cell.getValue()}
          </Link>
          {hasPermitExpired(expiryDate) ? (
            <PermitChip permitStatus={PERMIT_EXPIRED} />
          ) : (
            <PermitChip permitStatus={permitStatus} />
          )}
        </>
      );
    },
    size: 180,
  },
  {
    accessorKey: "permitType",
    header: "Permit Type",
    enableSorting: true,
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "permitData.commodities",
    header: "Commodity",
    enableSorting: true,
    sortingFn: "alphanumeric",
    // For TROS permits, commodities is not a concern.
    // Other permits will require implementation here.
    Cell: () => <>NA</>,
  },
  {
    accessorKey: "permitData.vehicleDetails.plate",
    header: "Plate",
    enableSorting: true,
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "permitData.companyName",
    header: "Company Name",
    enableSorting: true,
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "permitData.startDate",
    header: "Permit Start Date",
    enableSorting: true,
    sortingFn: dateTimeStringSortingFn,
    Cell: (props: { cell: any }) => {
      const formattedDate = formatCellValuetoDatetime(props.cell.getValue());
      return <div>{formattedDate}</div>;
    },
  },
  {
    accessorKey: "permitData.expiryDate",
    header: "Permit End Date",
    enableSorting: true,
    sortingFn: dateTimeStringSortingFn,
    Cell: (props: { cell: any }) => {
      const formattedDate = formatCellValuetoDatetime(props.cell.getValue());
      return <div>{formattedDate}</div>;
    },
  },
  {
    id: "permitIssueDateTime",
    header: "Issue Date",
    enableSorting: true,
    sortDescFirst: true,
    sortingFn: dateTimeStringSortingFn,
    accessorFn: (originalRow) => {
      const { permitIssueDateTime } = originalRow;
      const formattedDate = formatCellValuetoDatetime(permitIssueDateTime);
      return formattedDate;
    },
  },
];
