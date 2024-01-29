import { MRT_ColumnDef } from "material-react-table";
import {
  dateTimeStringSortingFn,
  formatCellValuetoDatetime,
} from "../../../../common/helpers/tableHelper";
import { CompanyProfile } from "../../../manageProfile/types/manageProfile";
import { Link } from "@mui/material";
import { useContext } from "react";
import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import { useNavigate } from "react-router-dom";

const useClickCompany = (selectedCompany: CompanyProfile) => {
  console.log("selectedCompany::", selectedCompany);
  const {
    setCompanyId,
    setCompanyLegalName,
    setOnRouteBCClientNumber,
  } = useContext(OnRouteBCContext);
  // const navigate = useNavigate();
  const { companyId, legalName, clientNumber } = selectedCompany;
  setCompanyId?.(() => companyId);
  setCompanyLegalName?.(() => legalName);
  setOnRouteBCClientNumber?.(() => clientNumber);

  // navigate('/applications');
};

/*
 *
 * The Columns Options are from Material React Table.
 * For a list of options, see here:
 * https://www.material-react-table.com/docs/api/column-options
 *
 */
export const CompanySearchResultColumnDef: MRT_ColumnDef<CompanyProfile>[] = [
  // {
  //   accessorKey: "legalName",
  //   header: "Company Name",
  //   enableSorting: true,
  //   sortingFn: "alphanumeric",
  //   Cell: (props: { row: any; cell: any }) => {
  //     return (
  //       <>
  //         <Link
  //           component="button"
  //           variant="body2"
  //           onClick={() => useClickCompany(props.row.original)}
  //         >
  //           {props.row.original.legalName}
  //         </Link>
  //       </>
  //     );
  //   },
  // },
  {
    accessorKey: "alternateName",
    header: "Doing Business As (DBA)",
    enableSorting: true,
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "clientNumber",
    header: "onRouteBC Client Number",
    enableSorting: true,
    sortingFn: "alphanumeric",
  },
  // {
  //   accessorKey: "mailingAddress",
  //   header: "Company Address",
  //   enableSorting: true,
  //   sortingFn: "alphanumeric",
  // },
  // {
  //   accessorKey: "primaryContact",
  //   header: "Primary Contact",
  //   enableSorting: true,
  //   sortingFn: "alphanumeric",
  // },
];
