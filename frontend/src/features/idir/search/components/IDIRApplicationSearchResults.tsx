import { Box, FormControlLabel, IconButton, Tooltip } from "@mui/material";
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
// import { hasPermitExpired } from "../../../permits/helpers/permitState";
// import { isPermitInactive } from "../../../permits/types/PermitStatus";
import { Permit } from "../../../permits/types/permit";
import { getApplicationDataBySearch } from "../api/idirSearch";
import { ApplicationSearchResultColumnDef } from "../table/ApplicationSearchResultColumnDef";
import { SearchFields } from "../types/types";
// import { IDIRApplicationSearchRowActions } from "./IDIRApplicationSearchRowActions";
import {
  defaultTableInitialStateOptions,
  defaultTableOptions,
  defaultTableStateOptions,
} from "../../../../common/helpers/tableHelper";
import "./IDIRPermitSearchResults.scss";
import { Delete, Search } from "@mui/icons-material";
import { NoRecordsFound } from "../../../../common/components/table/NoRecordsFound";

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
export const IDIRApplicationSearchResults = memo(
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
    // const [isActiveRecordsOnly, setIsActiveRecordsOnly] =
    //   useState<boolean>(false);
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
        getApplicationDataBySearch(
          {
            searchByFilter,
            searchEntity,
            searchString: searchString,
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
    const columns = useMemo<MRT_ColumnDef<Permit>[]>(
      () => ApplicationSearchResultColumnDef,
      [],
    );

    /**
     *
     * @param initialData The initial data to filter by the active data toggle.
     * @returns Permit[] containing the data to be displayed in table.
     */
    const getFilteredData = (initialData: Permit[]): Permit[] => {
      if (!initialData.length) return [];
      // if (isActiveRecordsOnly) {
      //   // Returns unexpired permits
      //   return initialData.filter(
      //     ({ permitStatus, permitData: { expiryDate } }) =>
      //       !hasPermitExpired(expiryDate) && !isPermitInactive(permitStatus),
      //   );
      // }
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
                <Search/>
              }
              // label="Active Permits Only"
              // labelPlacement="end"
            />
          </Box>
        );
      },
      renderRowActions: useCallback(({ row }: { row: MRT_Row<Permit> }) => {
        // const isInactive =
        //   hasPermitExpired(row.original.permitData.expiryDate) ||
        //   isPermitInactive(row.original.permitStatus);

        console.log(row.original.permitStatus);

        if (shouldShowRowActions(idirUserDetails?.userAuthGroup)) {
          return (
            // <Box className="idir-search-results__row-actions">
            //   <IDIRApplicationSearchRowActions
            //     isPermitInactive={isInactive}
            //     permitNumber={row.original.permitNumber}
            //     permitId={row.original.permitId}
            //     userAuthGroup={idirUserDetails?.userAuthGroup}
            //   />
            // </Box>
            <Box className="table-container__row-actions">
          <Tooltip arrow placement="top" title="Delete">
            <IconButton
              color="error"
              // onClick={() => {
              //   setIsDeleteDialogOpen(() => true);
              //   setRowSelection(() => {
              //     const newObject: { [key: string]: boolean } = {};
              //     // Setting the selected row to false so that
              //     // the row appears unchecked.
              //     newObject[row.original.permitId] = false;
              //     return newObject;
              //   });
              // }}
              disabled={false}
            >
              <Delete />
            </IconButton>
          </Tooltip>
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
    {data?.items.length === 0 ? (
      <NoRecordsFound />
    ) : (
      <MaterialReactTable table={table} />
    )}
  </div>
    );
  },
);

IDIRApplicationSearchResults.displayName = "SearchResults";
