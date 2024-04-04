import { MRT_ColumnDef } from "material-react-table";

import { CustomActionLink } from "../../../../common/components/links/CustomActionLink";
import { PermitListItem } from "../../../permits/types/permit";
import { PERMIT_EXPIRED } from "../../../permits/types/PermitStatus";
import { PermitChip } from "../../../permits/components/permit-list/PermitChip";
import { viewPermitPdf } from "../../../permits/helpers/permitPDFHelper";
import { hasPermitExpired } from "../../../permits/helpers/permitState";
import {
  dateTimeStringSortingFn,
  formatCellValuetoDatetime,
} from "../../../../common/helpers/tableHelper";
import { getPermitTypeName } from "../../../permits/types/PermitType";
import { Box, Tooltip } from "@mui/material";

/*
 *
 * The Columns Options are from Material React Table.
 * For a list of options, see here:
 * https://www.material-react-table.com/docs/api/column-options
 *
 */
export const PermitSearchResultColumnDef: MRT_ColumnDef<PermitListItem>[] = [
  {
    accessorKey: "permitNumber",
    header: "Permit #",
    enableSorting: true,
    sortingFn: "alphanumeric",
    Cell: (props: { cell: any; row: any }) => {
      const permit = props.row.original as PermitListItem;
      const {
        permitId,
        permitStatus,
        expiryDate,
      } = permit;

      return (
        <>
          <CustomActionLink
            onClick={() => viewPermitPdf(permitId.toString())}
          >
            {props.cell.getValue()}
          </CustomActionLink>
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
    Cell: (props: { cell: any; }) => {
      const permitTypeName = getPermitTypeName(props.cell.getValue())
      return <Tooltip title={permitTypeName}>
        <Box>
          {props.cell.getValue()}
        </Box>
      </Tooltip>
    }
  },
  {
    header: "Commodity",
    enableSorting: true,
    sortingFn: "alphanumeric",
    // For TROS permits, commodities is not a concern.
    // Other permits will require implementation here.
    Cell: () => <>NA</>,
  },
  {
    accessorKey: "plate",
    header: "Plate",
    enableSorting: true,
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "legalName",
    header: "Company Name",
    enableSorting: true,
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "startDate",
    header: "Permit Start Date",
    enableSorting: true,
    sortingFn: dateTimeStringSortingFn,
    Cell: (props: { cell: any }) => {
      const formattedDate = formatCellValuetoDatetime(props.cell.getValue());
      return formattedDate;
    },
  },
  {
    accessorKey: "expiryDate",
    header: "Permit End Date",
    enableSorting: true,
    sortingFn: dateTimeStringSortingFn,
    Cell: (props: { cell: any }) => {
      const formattedDate = formatCellValuetoDatetime(props.cell.getValue());
      return formattedDate;
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
