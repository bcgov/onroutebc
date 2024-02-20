import { MRT_ColumnDef } from "material-react-table";

import { CustomActionLink } from "../../../../common/components/links/CustomActionLink";
import { Permit } from "../../../permits/types/permit";
import { PERMIT_EXPIRED } from "../../../permits/types/PermitStatus";
import { PermitChip } from "../../../permits/components/permit-list/PermitChip";
import { viewPermitPdf } from "../../../permits/helpers/permitPDFHelper";
import { hasPermitExpired } from "../../../permits/helpers/permitState";
import {
  dateTimeStringSortingFn,
  formatCellValuetoDatetime,
} from "../../../../common/helpers/tableHelper";

/*
 *
 * The Columns Options are from Material React Table.
 * For a list of options, see here:
 * https://www.material-react-table.com/docs/api/column-options
 *
 */
export const ApplicationSearchResultColumnDef: MRT_ColumnDef<Permit>[] = [
  {
    accessorKey: "applicationNumber",
    header: "Application #",
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
  },
  {
    accessorKey: "permitData.unitNumber",
    header: "Unit #",
    enableSorting: true,
    sortingFn: "alphanumeric",
    // For TROS permits, commodities is not a concern.
    // Other permits will require implementation here.
    Cell: () => <>NA</>,
  },
  {
    accessorKey: "permitData.vehicleDetails.vin",
    header: "VIN",
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
    Cell: (props: { cell: any }) => {
      const formattedDate = formatCellValuetoDatetime(props.cell.getValue());
      return formattedDate;
    },
  },
  {
    accessorKey: "permitData.expiryDate",
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
  {
    accessorKey: "permitData.companyName",
    header: "Applicant",
    enableSorting: true,
    sortingFn: "alphanumeric",
  }
];
