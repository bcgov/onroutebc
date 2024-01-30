import { MRT_ColumnDef } from "material-react-table";
import { CompanyProfile } from "../../../manageProfile/types/manageProfile";
import CountriesAndStates from "../../../../common/constants/countries_and_states.json";
import { getDefaultRequiredVal } from "../../../../common/helpers/util";

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
    Cell: (props: { row: any }) => {
      const mailingAddress = props.row?.original?.mailingAddress
      const country = CountriesAndStates.filter((country) => {
        return country?.code === mailingAddress?.countryCode
      })

      const province = country[0]?.states?.filter((state) => {
        return state?.code === mailingAddress?.provinceCode
      })

      const addressLine1 = getDefaultRequiredVal(null, mailingAddress?.addressLine1);
      const addressLine2 = getDefaultRequiredVal(null, mailingAddress?.addressLine2);
      const countryName = getDefaultRequiredVal(null, country[0]?.name);
      const provinceName = getDefaultRequiredVal(null, province[0]?.name);
      const cityName = getDefaultRequiredVal(null, mailingAddress?.city);
      const postalCodeName = getDefaultRequiredVal(null, mailingAddress?.postalCode);

      return (
        <>
          {addressLine1 ? addressLine1 : null} {addressLine1 && <br />}
          {addressLine2 ? addressLine2 : null} {addressLine2 && <br />}
          {countryName ? countryName : null} {countryName && <br />}
          {provinceName ? provinceName : null} {provinceName && <br />}
          {cityName ? cityName : null} {postalCodeName ? postalCodeName : null}
        </>
      );
    },
  },
  {
    accessorKey: "primaryContact.firstName",
    header: "Primary Contact",
    enableSorting: true,
    sortingFn: "alphanumeric",
    Cell: (props: { row: any }) => {
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
