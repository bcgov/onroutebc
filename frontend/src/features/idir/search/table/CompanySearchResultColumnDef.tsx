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
    accessorKey: "clientNumber",
    header: "onRouteBC Client No.",
    enableSorting: true,
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "mailingAddress.addressLine1",
    header: "Company Address",
    enableSorting: true,
    sortingFn: "alphanumeric",
    Cell: (props: { cell: any; row: any }) => {
      const mailingAddress = props.row?.original?.mailingAddress
      //console.log('mailingAddress', mailingAddress)
      const country = mailingAddress?.countryCode === 'CA' ? 'Canada' : mailingAddress?.countryCode

      return (
        <>
          {mailingAddress?.addressLine1}<br />
          {mailingAddress?.city}<br />
          {mailingAddress?.provinceCode}<br />
          {country} {mailingAddress?.postalCode}
        </>
      );
    },
  },
  {
    accessorKey: "primaryContact.firstName",
    header: "Primary Contact",
    enableSorting: true,
    sortingFn: "alphanumeric",
    Cell: (props: { cell: any; row: any }) => {
      const contact = props.row?.original?.primaryContact

      return (
        <>
          {contact?.firstName} {contact?.lastName}<br />
          {contact?.email}<br />
          {contact?.phone}
        </>
      );
    },
  },
];
