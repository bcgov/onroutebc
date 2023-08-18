import { Box, FormControlLabel, Switch } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import MaterialReactTable, {
  MRT_ColumnDef,
  MRT_Row,
  MRT_TableInstance,
} from "material-react-table";
import { memo, useCallback, useContext, useMemo, useState } from "react";
import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import { BC_COLOURS } from "../../../../themes/bcGovStyles";
import { hasPermitExpired } from "../../../permits/helpers/permitPDFHelper";
import { ReadPermitDto } from "../../../permits/types/permit";
import { getDataBySearch } from "../api/idirSearch";
import { PermitSearchResultColumnDef } from "../table/Columns";
import { SearchFields } from "../types/types";
import { IDIRPermitSearchRowActions } from "./IDIRPermitSearchRowActions";
import "./List.scss";

/**
 * Function to decide whether to show row actions icon or not.
 * @param userAuthGroup The auth group the user belongs to.
 * @returns boolean
 */
const shouldShowRowActions = (userAuthGroup: string | undefined): boolean => {
  if (!userAuthGroup) return false;
  // Check if the user has PPC role to confirm
  return userAuthGroup === "PPC_CLERK";
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
    const { userDetails } = useContext(OnRouteBCContext);
    const [isActiveRecordsOnly, setIsActiveRecordsOnly] =
      useState<boolean>(false);
    const { data, isLoading, isError } = useQuery(
      ["search-entity", searchValue, searchByFilter, searchEntity],
      () =>
        getDataBySearch({
          searchByFilter,
          searchEntity,
          searchValue,
        }),
      { retry: false, enabled: true, refetchInterval: false }
    );

    // Column definitions for the table
    const columns = useMemo<MRT_ColumnDef<ReadPermitDto>[]>(
      () => PermitSearchResultColumnDef,
      []
    );

    /**
     *
     * @param initialData The initial data to filter by the active data toggle.
     * @returns ReadPermitDto[] containing the data to be displayed in table.
     */
    const getFilteredData = (initialData: ReadPermitDto[]): ReadPermitDto[] => {
      if (!initialData.length) return [];
      if (isActiveRecordsOnly) {
        // Returns unexpired permits
        return initialData.filter(
          ({ permitData: { expiryDate } }) => !hasPermitExpired(expiryDate)
        );
      }
      return initialData;
    };

    return (
      <div className="table-container">
        <MaterialReactTable
          // Required Props
          data={getFilteredData(data?.items ?? [])}
          columns={columns}
          enableTopToolbar={true}
          // Empty Toolbar actions to prevent the default actions.
          renderToolbarInternalActions={() => <></>}
          enableSorting
          renderTopToolbarCustomActions={() => {
            return (
              <Box sx={{ display: "flex", gap: "1rem", p: "4px" }}>
                <FormControlLabel
                  value="end"
                  control={
                    <Switch
                      color="primary"
                      checked={isActiveRecordsOnly}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        setIsActiveRecordsOnly(() => event.target.checked);
                      }}
                    />
                  }
                  label="Active Permits Only"
                  labelPlacement="end"
                />
              </Box>
            );
          }}
          state={{
            isLoading,
            showAlertBanner: isError,
            showProgressBars: isLoading,
            sorting: [{ id: "createdDateTime", desc: true }],
          }}
          // Disable the default column actions so that we can use our custom actions
          enableColumnActions={false}
          enableRowActions={true}
          selectAllMode="page"
          enableStickyHeader
          positionActionsColumn="last"
          displayColumnDefOptions={{
            "mrt-row-actions": {
              header: "",
            },
          }}
          renderRowActions={useCallback(
            ({
              row,
            }: {
              table: MRT_TableInstance<ReadPermitDto>;
              row: MRT_Row<ReadPermitDto>;
            }) => {
              const isExpired = hasPermitExpired(
                row.original.permitData.expiryDate
              );
              if (shouldShowRowActions(userDetails?.userAuthGroup)) {
                return (
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <IDIRPermitSearchRowActions
                      isExpired={isExpired}
                      permitNumber={row.original.permitNumber}
                      permitId={row.original.permitId}
                    />
                  </Box>
                );
              } else {
                return <></>;
              }
            },
            []
          )}
          /*
           *
           * STYLES
           *
           */

          // Main table container
          muiTablePaperProps={{
            sx: {
              border: "none",
              boxShadow: "none",
            },
          }}
          // Column widths
          defaultColumn={{
            maxSize: 200, //allow columns to get larger than default
            minSize: 25,
            size: 50,
          }}
          // Cell/Body container
          muiTableContainerProps={{
            sx: {
              outline: "1px solid #DBDCDC",
              height: "calc(100vh - 475px)",
            },
          }}
          // Pagination
          muiBottomToolbarProps={{
            sx: {
              zIndex: 0, // resolve z-index conflict with sliding panel
              backgroundColor: BC_COLOURS.bc_background_light_grey,
            },
          }}
          // Top toolbar
          muiTopToolbarProps={{ sx: { zIndex: 0 } }} // resolve z-index conflict with sliding panel
          // Alert banner
          muiToolbarAlertBannerProps={
            isError
              ? {
                  color: "error",
                  children: "Error loading data",
                }
              : undefined
          }
          muiSearchTextFieldProps={{
            placeholder: "Search",
            sx: {
              minWidth: "300px",
              backgroundColor: "white",
            },
            variant: "outlined",
            inputProps: {
              sx: {
                padding: "10px",
              },
            },
          }}
          // Row Header
          muiTableHeadRowProps={{
            sx: { backgroundColor: BC_COLOURS.bc_background_light_grey },
          }}
        />
      </div>
    );
  }
);

IDIRSearchResults.displayName = "SearchResults";
