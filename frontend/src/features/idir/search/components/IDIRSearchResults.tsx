import { Box, FormControlLabel, Switch } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { memo, useCallback, useContext, useMemo, useState } from "react";

import {
  MRT_ColumnDef,
  MRT_PaginationState,
  MRT_Row as MrtRow,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import { TEN_MINUTES } from "../../../../common/constants/constants";
import {
  defaultTableInitialStateOptions,
  defaultTableOptions,
  defaultTableStateOptions,
} from "../../../../common/constants/defaultTableOptions";
import { Optional } from "../../../../common/types/common";
import { USER_AUTH_GROUP } from "../../../manageProfile/types/userManagement.d";
import { hasPermitExpired } from "../../../permits/helpers/permitState";
import { isPermitInactive } from "../../../permits/types/PermitStatus";
import { Permit } from "../../../permits/types/permit";
import { getDataBySearch } from "../api/idirSearch";
import { PermitSearchResultColumnDef } from "../table/Columns";
import { SearchFields } from "../types/types";
import { IDIRPermitSearchRowActions } from "./IDIRPermitSearchRowActions";
import "./IDIRSearchResults.scss";

/**
 * Function to decide whether to show row actions icon or not.
 * @param userAuthGroup The auth group the user belongs to.
 * @returns boolean
 */
const shouldShowRowActions = (userAuthGroup: Optional<string>): boolean => {
  if (!userAuthGroup) return false;
  // Check if the user has PPC role to confirm
  const allowableAuthGroups = [
    USER_AUTH_GROUP.PPCCLERK,
    USER_AUTH_GROUP.EOFFICER,
    USER_AUTH_GROUP.SYSADMIN,
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
export const IDIRSearchResults = memo(
  ({
    searchParams,
  }: {
    /**
     * The search parameters entered by the user.
     */
    searchParams: SearchFields;
  }) => {
    const { searchValue, searchByFilter, searchEntity } = searchParams;
    const { idirUserDetails } = useContext(OnRouteBCContext);
    const [isActiveRecordsOnly, setIsActiveRecordsOnly] =
      useState<boolean>(false);
    const [pagination, setPagination] = useState<MRT_PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });
    const searchResultsQuery = useQuery(
      [
        "search-entity",
        searchValue,
        searchByFilter,
        searchEntity,
        pagination.pageIndex,
        pagination.pageSize,
      ],
      () =>
        getDataBySearch(
          {
            searchByFilter,
            searchEntity,
            searchValue,
          },
          { page: pagination.pageIndex, take: pagination.pageSize },
        ),
      {
        retry: 1, // retry once.
        enabled: true,
        refetchInterval: false,
        staleTime: TEN_MINUTES,
        keepPreviousData: true,
      },
    );

    const { data, isLoading, isError } = searchResultsQuery;

    // Column definitions for the table
    const columns = useMemo<MRT_ColumnDef<Permit>[]>(
      () => PermitSearchResultColumnDef,
      [],
    );

    /**
     *
     * @param initialData The initial data to filter by the active data toggle.
     * @returns Permit[] containing the data to be displayed in table.
     */
    const getFilteredData = (initialData: Permit[]): Permit[] => {
      if (!initialData.length) return [];
      if (isActiveRecordsOnly) {
        // Returns unexpired permits
        return initialData.filter(
          ({ permitStatus, permitData: { expiryDate } }) =>
            !hasPermitExpired(expiryDate) && !isPermitInactive(permitStatus),
        );
      }
      return initialData;
    };

    const table = useMaterialReactTable({
      ...defaultTableOptions,
      data: getFilteredData(data?.items ?? []),
      columns: columns,
      initialState: {
        ...defaultTableInitialStateOptions,
        sorting: [{ id: "permitIssueDateTime", desc: true }],
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
      renderRowActions: useCallback(({ row }: { row: MrtRow<Permit> }) => {
        const isInactive =
          hasPermitExpired(row.original.permitData.expiryDate) ||
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
      }, []),
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

IDIRSearchResults.displayName = "SearchResults";
