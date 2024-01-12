import { MRT_ColumnDef } from "material-react-table";
import {
  dateTimeStringSortingFn,
  formatCellValuetoDatetime
} from "../../../../common/helpers/tableHelper";
import { CompanyProfile } from "../../../manageProfile/types/manageProfile";

/*
 *
 * The Columns Options are from Material React Table.
 * For a list of options, see here:
 * https://www.material-react-table.com/docs/api/column-options
 *
 */
export const CompanySearchResultColumnDef: MRT_ColumnDef<CompanyProfile>[] = [
  {
    accessorKey: "legalName",
    header: "Company Name",
    enableSorting: true,
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "alternateName",
    header: "Doing Business As (DBA)",
    enableSorting: true,
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "migratedClientHash",
    header: "Client Number",
    enableSorting: true,
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "mailingAddress",
    header: "Company Address",
    enableSorting: true,
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "primaryContact",
    header: "Primary Contact",
    enableSorting: true,
    sortingFn: "alphanumeric",
  },
];
