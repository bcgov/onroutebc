import { Box, FormControlLabel, Switch } from "@mui/material";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
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
import { hasPermitExpired } from "../../../permits/helpers/permitState";
import { isPermitInactive } from "../../../permits/types/PermitStatus";
import { PermitListItem } from "../../../permits/types/permit";
import { getPermitDataBySearch } from "../api/idirSearch";
import { PermitSearchResultColumnDef } from "../table/PermitSearchResultColumnDef";
import { SearchFields } from "../types/types";
import { IDIRPermitSearchRowActions } from "./IDIRPermitSearchRowActions";
import {
  defaultTableInitialStateOptions,
  defaultTableOptions,
  defaultTableStateOptions,
} from "../../../../common/helpers/tableHelper";
import "./IDIRPermitSearchResults.scss";

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
export const IDIRPermitSearchResults = memo(
  ({
    searchParams,
  }: {
    /**
     * The search parameters entered by the user.
     */
    searchParams: SearchFields;
  }) => {
    const { searchString, searchByFilter, searchEntity } = searchParams;
    const { idirUserDetails } = useContext(OnRouteBCContext);
    const [isActiveRecordsOnly, setIsActiveRecordsOnly] =
      useState<boolean>(false);
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
        isActiveRecordsOnly,
        pagination.pageIndex,
        pagination.pageSize,
      ],
      queryFn: () =>
        getPermitDataBySearch(
          {
            searchByFilter,
            searchEntity,
            searchString,
          },
          {
            expired: !isActiveRecordsOnly,
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
    const columns = useMemo<MRT_ColumnDef<PermitListItem>[]>(
      () => PermitSearchResultColumnDef,
      [],
    );

    const table = useMaterialReactTable({
      ...defaultTableOptions,
      data: data?.items ?? [],
      columns: columns,
      initialState: {
        ...defaultTableInitialStateOptions,
        sorting: [{ id: "permitIssueDateTime", desc: true }],
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
      renderTopToolbarCustomActions: () => {
        return (
          <Box sx={{ display: "flex", gap: "1rem", p: "4px" }}>
            <FormControlLabel
              value="end"
              control={
                <Switch
                  color="primary"
                  checked={isActiveRecordsOnly}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setIsActiveRecordsOnly(() => event.target.checked);
                  }}
                />
              }
              label="Active Permits Only"
              labelPlacement="end"
            />
          </Box>
        );
      },
      renderRowActions: useCallback(
        ({ row }: { row: MRT_Row<PermitListItem> }) => {
          const isInactive =
            hasPermitExpired(row.original.expiryDate) ||
            isPermitInactive(row.original.permitStatus);

          if (shouldShowRowActions(idirUserDetails?.userAuthGroup)) {
            return (
              <Box className="idir-search-results__row-actions">
                <IDIRPermitSearchRowActions
                  isPermitInactive={isInactive}
                  permitNumber={row.original.permitNumber}
                  permitId={row.original.permitId}
                  userAuthGroup={idirUserDetails?.userAuthGroup}
                />
              </Box>
            );
          } else {
            return <></>;
          }
        },
        [],
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

IDIRPermitSearchResults.displayName = "SearchResults";
