import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  MRT_ColumnDef,
  MRT_PaginationState,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { memo, useContext, useMemo, useState } from "react";

import { Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import {
  defaultTableInitialStateOptions,
  defaultTableOptions,
  defaultTableStateOptions,
} from "../../../../common/helpers/tableHelper";
import { CompanyProfile } from "../../../manageProfile/types/manageProfile";
import { getCompanyDataBySearch } from "../api/idirSearch";
import { CompanySearchResultColumnDef } from "../table/CompanySearchResultColumnDef";
import { SearchFields } from "../types/types";
import "./IDIRCompanySearchResults.scss";

/*
 *
 * The search results component uses Material React Table (MRT)
 * For detailed documentation, see here:
 * https://www.material-react-table.com/docs/getting-started/usage
 *
 *
 */
export const IDIRCompanySearchResults = memo(
  ({
    searchParams,
  }: {
    /**
     * The search parameters entered by the user.
     */
    searchParams: SearchFields;
  }) => {
    const {
      searchString: searchString,
      searchByFilter,
      searchEntity,
    } = searchParams;
    const { setCompanyId, setCompanyLegalName, setOnRouteBCClientNumber } =
      useContext(OnRouteBCContext);

    const navigate = useNavigate();

    const onClickCompany = (selectedCompany: CompanyProfile) => {
      console.log("selectedCompany::", selectedCompany);
      // const navigate = useNavigate();
      const { companyId, legalName, clientNumber } = selectedCompany;
      setCompanyId?.(() => companyId);
      setCompanyLegalName?.(() => legalName);
      setOnRouteBCClientNumber?.(() => clientNumber);
      sessionStorage.setItem("onRouteBC.user.companyId", companyId.toString());

      navigate("/applications");
    };
    const [isActiveRecordsOnly, setIsActiveRecordsOnly] =
      useState<boolean>(false);
    const [pagination, setPagination] = useState<MRT_PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });

    // TODO: if data is [] AND current_user is PPC_ADMIN then (eventually)
    //  display the UX to allow the creation of a new Company Profile
    const searchResultsQuery = useQuery({
      queryKey: [
        "search-entity",
        searchString,
        searchByFilter,
        searchEntity,
        pagination.pageIndex,
        pagination.pageSize,
      ],
      queryFn: () => getCompanyDataBySearch(
        {
          searchByFilter,
          searchEntity,
          searchString,
        },
        { page: pagination.pageIndex, take: pagination.pageSize },
      ),
      retry: 1, // retry once.
      enabled: true,
      refetchOnWindowFocus: false,
      placeholderData: keepPreviousData,
    });

    const { data, isPending, isError } = searchResultsQuery;

    // Column definitions for the table
    const columns = useMemo<MRT_ColumnDef<CompanyProfile>[]>(
      () => [
        {
          accessorKey: "legalName",
          header: "Company Name",
          enableSorting: true,
          sortingFn: "alphanumeric",
          Cell: (props: { row: any; cell: any }) => {
            return (
              <>
                <Link
                  component="a"
                  sx={{
                    cursor: "pointer",
                  }}
                  variant="body2"
                  onClick={() => onClickCompany(props.row.original)}
                >
                  {props.row.original.legalName}
                </Link>
              </>
            );
          },
        },
        ...CompanySearchResultColumnDef,
      ],
      [],
    );

    const table = useMaterialReactTable({
      ...defaultTableOptions,
      data: data?.items ?? [],
      columns: columns,
      initialState: {
        ...defaultTableInitialStateOptions,
        sorting: [],
      },
      state: {
        ...defaultTableStateOptions,
        isLoading: isPending,
        showAlertBanner: isError,
        showProgressBars: isPending,
        pagination,
      },
      autoResetPageIndex: false,
      manualPagination: true,
      rowCount: data?.meta?.totalItems ?? 0,
      pageCount: data?.meta?.pageCount ?? 0,
      onPaginationChange: setPagination,
      enablePagination: true,
      enableTopToolbar: true,
      enableBottomToolbar: true,
      enableRowSelection: false,
      enableGlobalFilter: false,
      renderToolbarInternalActions: () => (
        <div className="toolbar-internal"></div>
      ),
      muiToolbarAlertBannerProps: isError
        ? {
            color: "error",
            children: "Error loading data",
          }
        : undefined,
    });

    return (
      <div className="table-container idir-search-results">
        <MaterialReactTable table={table} />
      </div>
    );
  },
);

IDIRCompanySearchResults.displayName = "SearchResults";
