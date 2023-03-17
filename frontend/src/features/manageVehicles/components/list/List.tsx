import { memo, useCallback, useEffect, useMemo, useState } from "react";
import MaterialReactTable, {
  MRT_ColumnDef,
  MRT_GlobalFilterTextField,
  MRT_Row,
  MRT_TableInstance,
} from "material-react-table";
import "./List.scss";
import { Box, IconButton, Tooltip } from "@mui/material";
import { VehicleTypes, VehicleTypesAsString } from "../../types/managevehicles";

import { Filter } from "../options/Filter";
import { Trash } from "../options/Trash";
import { CSVOptions } from "../options/CSVOptions";
import { Delete, Edit, ContentCopy } from "@mui/icons-material";
import { BC_COLOURS } from "../../../../themes/bcGovStyles";
import { useQuery } from "@tanstack/react-query";
import { getAllPowerUnits, getAllTrailers } from "../../apiManager/vehiclesAPI";
import { CustomSnackbar } from "../../../../common/components/snackbar/CustomSnackBar";
import { PowerUnitColumnDefinition, TrailerColumnDefinition } from "./Columns";

/**
 * Creates a useQuery object based on the vehicle type
 * For customization see:
 * https://react-query-v3.tanstack.com/reference/useQuery
 * @param vehicleType Either "powerUnit" | "trailer"
 * @returns useQuery object
 */
const createVehicleQuery = (vehicleType: string) => {
  let query;
  const keepPreviousData = true;
  const staleTime = 5000;

  if (vehicleType === "powerUnit")
    query = useQuery({
      queryKey: ["powerUnits"],
      queryFn: getAllPowerUnits,
      keepPreviousData: keepPreviousData,
      staleTime: staleTime,
    });
  else {
    query = useQuery({
      queryKey: ["trailers"],
      queryFn: getAllTrailers,
      keepPreviousData: keepPreviousData,
      staleTime: staleTime,
    });
  }

  return query;
};

/**
 * Dynamically set the column based on vehicle type
 * @param vehicleType Either "powerUnit" | "trailer"
 * @returns An array of column headers/accessor keys ofr Material React Table
 */
const getColumns = (vehicleType: string): MRT_ColumnDef<VehicleTypes>[] => {
  if (vehicleType === "powerUnit") {
    return PowerUnitColumnDefinition;
  }
  return TrailerColumnDefinition;
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
export const List = memo(({ vehicleType }: VehicleTypesAsString) => {
  // Data, fetched from backend API
  const {
    data,
    isError,
    isFetching,
    isLoading,
    error,
    //refetch,
  } = createVehicleQuery(vehicleType);

  // Column definitions for the table
  const columns = useMemo<MRT_ColumnDef<VehicleTypes>[]>(
    () => getColumns(vehicleType),
    []
  );

  const handleDeleteRow = useCallback((row: MRT_Row<VehicleTypes>) => {
    if (
      !confirm(`Are you sure you want to delete ${row.getValue("unitNumber")}`)
    ) {
      return;
    }
    //send api delete request here, then refetch or update local table data for re-render
  }, []);

  // Start snackbar code for error handling
  const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);
  // Display error message from API call. If error is an unexpected type (not a string),
  // then display generic error message
  const errorMessage: string =
    typeof error === "string" ? error : "An unexpected error occured";

  useEffect(() => {
    if (isError) setShowErrorSnackbar(true);
  }, [isError]);
  // End snackbar code for error handling

  return (
    <div className="table-container">
      <CustomSnackbar
        showSnackbar={showErrorSnackbar}
        setShowSnackbar={setShowErrorSnackbar}
        message={errorMessage}
        isError={isError}
      />

      <MaterialReactTable
        // Required Props
        data={data ?? []}
        columns={columns}
        // State variables and actions
        //rowCount={rowCount}
        state={{
          isLoading,
          showAlertBanner: isError,
          showProgressBars: isFetching,
          sorting: [{ id: "createdDateTime", desc: true }],
        }}
        // Disable the default column actions so that we can use our custom actions
        enableColumnActions={false}
        // Enable checkboxes for row selection
        enableRowSelection={true}
        // Row copy, delete, and edit options
        enableRowActions={true}
        enableStickyHeader
        positionActionsColumn="last"
        displayColumnDefOptions={{
          "mrt-row-actions": {
            header: "",
          },
        }}
        renderRowActions={useCallback(
          ({
            table,
            row,
          }: {
            table: MRT_TableInstance<VehicleTypes>;
            row: MRT_Row<VehicleTypes>;
          }) => (
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Tooltip arrow placement="left" title="Edit">
                {/*tslint:disable-next-line*/}
                <IconButton
                  onClick={() => table.setEditingRow(row)}
                  disabled={true}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip arrow placement="top" title="Copy">
                {/*tslint:disable-next-line*/}
                <IconButton
                  onClick={() => table.setEditingRow(row)}
                  disabled={true}
                >
                  <ContentCopy />
                </IconButton>
              </Tooltip>
              <Tooltip arrow placement="top" title="Delete">
                {/*tslint:disable-next-line*/}
                <IconButton
                  color="error"
                  onClick={() => handleDeleteRow(row)}
                  disabled={true}
                >
                  <Delete />
                </IconButton>
              </Tooltip>
            </Box>
          ),
          []
        )}
        // Render a custom options Bar (inclues search, filter, trash, and csv options)
        renderTopToolbar={useCallback(
          ({ table }: { table: MRT_TableInstance<VehicleTypes> }) => (
            <Box
              sx={{
                display: "flex",
                padding: "20px 0px",
                backgroundColor: "white",
              }}
            >
              <MRT_GlobalFilterTextField table={table} />
              <Filter />
              <Trash />
              <CSVOptions />
            </Box>
          ),
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
            height: "calc(100vh - 160px)",
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
        // Search Bar
        positionGlobalFilter="left"
        initialState={{ showGlobalFilter: true }} //show the search bar by default
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

List.displayName = "List";
