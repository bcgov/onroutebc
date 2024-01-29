import { useQuery } from "@tanstack/react-query";
import { memo, useCallback, useContext, useMemo, useState } from "react";

import {
  MRT_ColumnDef,
  MRT_PaginationState,
  MRT_Row,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import { Optional } from "../../../../common/types/common";
import { USER_AUTH_GROUP } from "../../../../common/authentication/types";
import { getCompanyDataBySearch } from "../api/idirSearch";
import { SearchFields } from "../types/types";
import {
  defaultTableInitialStateOptions,
  defaultTableOptions,
  defaultTableStateOptions,
} from "../../../../common/helpers/tableHelper";
import "./IDIRCompanySearchResults.scss";
import { CompanyProfile } from "../../../manageProfile/types/manageProfile";
import { CompanySearchResultColumnDef } from "../table/CompanySearchResultColumnDef";

/**
 * Function to decide whether to show row actions icon or not.
 * @param userAuthGroup The auth group the user belongs to.
 * @returns boolean
 */
const shouldShowRowActions = (userAuthGroup: Optional<string>): boolean => {
  if (!userAuthGroup) return false;
  // Check if the user has PPC role to confirm
  const allowableAuthGroups = [
    USER_AUTH_GROUP.PPC_CLERK,
    USER_AUTH_GROUP.ENFORCEMENT_OFFICER,
    USER_AUTH_GROUP.SYSTEM_ADMINISTRATOR,
  ] as string[];
  return allowableAuthGroups.includes(userAuthGroup);
};

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
    const { idirUserDetails } = useContext(OnRouteBCContext);
    const [isActiveRecordsOnly, setIsActiveRecordsOnly] =
      useState<boolean>(false);
    const [pagination, setPagination] = useState<MRT_PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });

    // TODO: if data is [] AND current_user is PPC_ADMIN then (eventually)
    //  display the UX to allow the creation of a new Company Profile
    const canCreateCompany = false;
    const searchResultsQuery = useQuery(
      [
        "search-entity",
        searchString,
        searchByFilter,
        searchEntity,
        pagination.pageIndex,
        pagination.pageSize,
      ],
      () =>
          getCompanyDataBySearch(
          {
            searchByFilter,
            searchEntity,
            searchString,
          },
          { page: pagination.pageIndex, take: pagination.pageSize },
        ),
      {
        retry: 1, // retry once.
        enabled: true,
        refetchOnWindowFocus: false,
        keepPreviousData: true,
      },
    );

    const { data, isLoading, isError } = searchResultsQuery;

    // Column definitions for the table
    const columns = useMemo<MRT_ColumnDef<CompanyProfile>[]>(
      () => CompanySearchResultColumnDef,
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
        isLoading,
        showAlertBanner: isError,
        showProgressBars: isLoading,
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
