import { Link } from "@mui/material";
import dayjs from "dayjs";
import { MRT_ColumnDef } from "material-react-table";
import { viewPermitPdf } from "../../../permits/components/permit-list/Columns";
import {
    EXPIRED_PERMIT_STATUS,
    PermitChip,
} from "../../../permits/components/permit-list/PermitChip";
import { ReadPermitDto } from "../../../permits/types/permit";

/**
 * Returns a boolean to indicate if a permit has expired.
 * @param expiryDate The expiry date of the permit
 * @returns boolean indicating if the permit has expired.
 */
export const hasPermitExpired = (expiryDate: string): boolean => {
  if (!expiryDate) return false;
  return dayjs().isAfter(expiryDate, "date");
};

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
    Cell: (props: { cell: any; row: any }) => {
      console.log("props.row::", props.row);
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
  },
  {
    accessorKey: "permitData.commodities",
    header: "Commodity",
    Cell: (props: { cell: any; row: any }) => {
      const permit = props.row.original as ReadPermitDto;
      const {
        permitData: { commodities },
      } = permit;
      return <>{commodities[0]}</>;
    },
  },
  {
    accessorKey: "permitData.vehicleDetails.plate",
    header: "Plate",
  },
  //   {
  //     accessorKey: "permitData",
  //     header: "Company Name",
  //   },
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
