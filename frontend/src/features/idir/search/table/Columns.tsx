import { Link } from "@mui/material";
import { MRT_ColumnDef } from "material-react-table";
import {
  EXPIRED_PERMIT_STATUS,
  PermitChip,
} from "../../../permits/components/permit-list/PermitChip";
import {
  hasPermitExpired,
  viewPermitPdf,
} from "../../../permits/helpers/permitPDFHelper";
import { ReadPermitDto } from "../../../permits/types/permit";

/*
 *
 * The Columns Options are from Material React Table.
 * For a list of options, see here:
 * https://www.material-react-table.com/docs/api/column-options
 *
 */
export const PermitSearchResultColumnDef: MRT_ColumnDef<ReadPermitDto>[] = [
  {
    accessorKey: "permitNumber",
    header: "Permit #",
    enableSorting: false,
    Cell: (props: { cell: any; row: any }) => {
      const permit = props.row.original as ReadPermitDto;
      const {
        permitId,
        permitStatus,
        permitData: { expiryDate },
      } = permit;
      let permitChip = undefined;
      if (permitStatus === "REVOKED" || permitChip == "VOIDED") {
        permitChip = (
          <PermitChip permitStatus={permitStatus as EXPIRED_PERMIT_STATUS} />
        );
      } else if (hasPermitExpired(expiryDate)) {
        permitChip = <PermitChip permitStatus="EXPIRED" />;
      }
      return (
        <>
          <Link
            component="button"
            variant="body2"
            onClick={() => viewPermitPdf(permitId.toString())}
          >
            {props.cell.getValue()}
          </Link>
          {permitChip}
        </>
      );
    },
    size: 200,
  },
  {
    accessorKey: "permitType",
    header: "Permit Type",
    enableSorting: false,
  },
  {
    accessorKey: "permitData.commodities",
    header: "Commodity",
    enableSorting: false,
    // For TROS permits, commodities is not a concern.
    // Other permits will require implementation here.
    Cell: () => <>NA</>,
  },
  {
    accessorKey: "permitData.vehicleDetails.plate",
    header: "Plate",
    enableSorting: false,
  },
  {
    accessorKey: "permitData.companyName",
    header: "Company Name",
    enableSorting: false,
  },
  {
    accessorKey: "permitData.startDate",
    header: "Permit Start Date",
    enableSorting: true,
  },
  {
    accessorKey: "permitData.expiryDate",
    header: "Permit End Date",
    enableSorting: true,
  },
  {
    accessorKey: "createdDateTime",
    header: "Issue Date",
    enableSorting: true,
    sortDescFirst: true,
  },
];
