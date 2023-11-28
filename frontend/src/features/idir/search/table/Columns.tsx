import { Link } from "@mui/material";
import { MRT_ColumnDef } from "material-react-table";

import { Permit } from "../../../permits/types/permit";
import { PERMIT_EXPIRED } from "../../../permits/types/PermitStatus";
import { PermitChip } from "../../../permits/components/permit-list/PermitChip";
import { applyWhenNotNullable } from "../../../../common/helpers/util";
import { DATE_FORMATS, toLocal } from "../../../../common/helpers/formatDate";
import {
  hasPermitExpired,
  viewPermitPdf,
} from "../../../permits/helpers/permitPDFHelper";

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
    size: 200,
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
    sortingFn: "datetime",
    Cell: (props: { cell: any; row: any }) => {
      const originalDate = props.cell.getValue()
      const formattedDate = applyWhenNotNullable(
        (dt) => toLocal(dt, DATE_FORMATS.DATEONLY_ABBR_MONTH),
        originalDate,
        "NA",
      );
      return (
        <div>
          {formattedDate}
        </div>
      );
    },
  },
  {
    accessorKey: "permitData.expiryDate",
    header: "Permit End Date",
    enableSorting: true,
    sortingFn: "datetime",
    Cell: (props: { cell: any; row: any }) => {
      const originalDate = props.cell.getValue()
      const formattedDate = applyWhenNotNullable(
        (dt) => toLocal(dt, DATE_FORMATS.DATEONLY_ABBR_MONTH),
        originalDate,
        "NA",
      );
      return (
        <div>
          {formattedDate}
        </div>
      );
    },
  },
  {
    accessorKey: "permitIssueDateTime",
    header: "Issue Date",
    enableSorting: true,
    sortDescFirst: true,
    sortingFn: "datetime",
    accessorFn: (originalRow) => {
      const { permitIssueDateTime } = originalRow;
      const formattedDate = applyWhenNotNullable(
        (dt) => toLocal(dt, DATE_FORMATS.DATEONLY_ABBR_MONTH),
        permitIssueDateTime,
        "NA",
      );
      return formattedDate;
    },
  },
];
