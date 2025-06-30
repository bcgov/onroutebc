import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  MRT_ColumnDef,
  MRT_PaginationState,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { memo, useMemo, useState } from "react";

import {
  defaultTableInitialStateOptions,
  defaultTableOptions,
  defaultTableStateOptions,
} from "../../../../common/helpers/tableHelper";
import * as routes from "../../../../routes/constants";
import { CompanyProfile } from "../../../manageProfile/types/manageProfile";
import { getCompanyDataBySearch } from "../api/idirSearch";
import { CompanySearchResultColumnDef } from "../table/CompanySearchResultColumnDef";
import { SearchFields } from "../types/types";
import "./IDIRCompanySearchResults.scss";
import { CustomNavLink } from "../../../../common/components/links/CustomNavLink";
import { NoRecordsFound } from "../../../../common/components/table/NoRecordsFound";
import { Box, CardMedia, Stack, Typography } from "@mui/material";
import { CustomActionLink } from "../../../../common/components/links/CustomActionLink";
import { StatusChip } from "../../../settings/components/creditAccount/StatusChip";
import { useSetCompanyHandler } from "../helpers/useSetCompanyHandler";
import { usePermissionMatrix } from "../../../../common/authentication/PermissionMatrix";

/*
 *
 * The search results component uses Material React Table (MRT)
 * For detailed documentation, see here:
 * https://www.material-react-table.com/docs/getting-started/usage
 *
 *
 */
export const IDIRCompanySearchResults = memo(
  ({ searchParams }: { searchParams: SearchFields }) => {
    const {
      searchString: searchString,
      searchByFilter,
      searchEntity,
    } = searchParams;

    const { handleSelectCompany } = useSetCompanyHandler();

    const [pagination, setPagination] = useState<MRT_PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });
    const searchResultsQuery = useQuery({
      queryKey: [
        "search-entity",
        searchString,
        searchByFilter,
        searchEntity,
        pagination.pageIndex,
        pagination.pageSize,
      ],
      queryFn: () =>
        getCompanyDataBySearch(
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

    const canCreateCompany = usePermissionMatrix({
      permissionMatrixKeys: {
        permissionMatrixFeatureKey: "GLOBAL_SEARCH",
        permissionMatrixFunctionKey: "CREATE_COMPANY",
      },
    });
    // Column definitions for the table
    const columns = useMemo<MRT_ColumnDef<CompanyProfile>[]>(
      () => [
        {
          accessorKey: "legalName",
          header: "Company Name",
          enableSorting: true,
          sortingFn: "alphanumeric",
          minSize: 220,
          Cell: (props: { row: any; cell: any }) => {
            const isCompanySuspended = props.row.original.isSuspended;
            return (
              <>
                <CustomActionLink
                  onClick={() => handleSelectCompany(props.row.original)}
                >
                  {props.row.original.legalName}
                </CustomActionLink>
                {isCompanySuspended && <StatusChip status="SUSPENDED" />}
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
      muiTableBodyCellProps: {
        className: "idir-company-search-results__cell",
      },
    });

    return (
      <div className="table-container idir-company-search-results">
        {data?.items?.length !== 0 && <MaterialReactTable table={table} />}
        {data?.items?.length === 0 && (
          <>
            <Stack display="flex" justifyContent="center" alignItems="center">
              <NoRecordsFound />
              {canCreateCompany && (
                <Box className="create-company-btn">
                  <CustomNavLink to={routes.IDIR_ROUTES.CREATE_COMPANY}>
                    <div className="button-outline">
                      <CardMedia
                        className="create-company-img"
                        component="img"
                        src="/Create_Company_Graphic.png"
                        alt="Create Company"
                        title="Create Company"
                      />
                      <Typography variant={"h3"}>
                        Create
                        <br />
                        Company
                      </Typography>
                    </div>
                  </CustomNavLink>
                </Box>
              )}
            </Stack>
          </>
        )}
      </div>
    );
  },
);

IDIRCompanySearchResults.displayName = "SearchResults";
