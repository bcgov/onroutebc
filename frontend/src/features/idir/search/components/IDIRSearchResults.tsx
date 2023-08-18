import { memo, useCallback, useMemo, useState } from "react";
import MaterialReactTable, {
  MRT_ColumnDef,
  MRT_Row,
  MRT_TableInstance,
} from "material-react-table";
import "./List.scss";
import { Box, FormControlLabel, Switch, Tooltip } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { IDIRPermitSearchRowActions } from "./IDIRPermitSearchRowActions";
import { PermitSearchResultColumnDef } from "../table/Columns";
import { getDataBySearch } from "../api/idirSearch";
import { ReadPermitDto } from "../../../permits/types/permit";
import { SearchByFilter, SearchEntity } from "../types/types";
import { BC_COLOURS } from "../../../../themes/bcGovStyles";

/**
 * Returns a boolean to indicate if a permit has expired.
 * @param expiryDate The expiry date of the permit
 * @returns boolean indicating if the permit has expired.
 */
const hasPermitExpired = (expiryDate: string): boolean => {
  if (!expiryDate) return false;
  return dayjs().isAfter(expiryDate, "date");
};

/*
 *
 * The List component uses Material React Table (MRT)
 * For detailed documentation, see here:
 * https://www.material-react-table.com/docs/getting-started/usage
 *
 *
 */
/* eslint-disable react/prop-types */
export const IDIRSearchResults = memo(() => {
  const { state: stateFromNavigation } = useLocation();
  const [isActiveRecordsOnly, setIsActiveRecordsOnly] =
    useState<boolean>(false);
  const { data, isLoading, isError } = useQuery(
    [
      "search-entity",
      stateFromNavigation?.searchValue,
      stateFromNavigation?.searchByFilter,
      stateFromNavigation?.searchEntity,
    ],
    () =>
      getDataBySearch({
        searchByFilter: stateFromNavigation?.searchByFilter as SearchByFilter,
        searchEntity: stateFromNavigation?.searchEntity as SearchEntity,
        searchValue: stateFromNavigation?.searchValue as string,
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
        }}
        state={{
          isLoading,
          showAlertBanner: isError,
          showProgressBars: isLoading,
          sorting: [{ id: "createdDateTime", desc: true }],
          columnVisibility: { powerUnitId: false, trailerId: false },
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
            return (
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <IDIRPermitSearchRowActions
                  isExpired={isExpired}
                  permitNumber={row.original.permitNumber}
                />
              </Box>
            );
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
});

IDIRSearchResults.displayName = "SearchResults";
