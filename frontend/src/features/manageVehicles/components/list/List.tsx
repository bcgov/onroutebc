import { memo, useContext, useEffect, useMemo, useState } from "react";
import MaterialReactTable, {
  MRT_ColumnDef,
  MRT_GlobalFilterTextField,
} from "material-react-table";
import "./List.scss";
import { Box } from "@mui/material";
import { IPowerUnit, VehiclesContextType } from "../../@types/managevehicles";
import { VehiclesContext } from "../../context/VehiclesContext";
import { columnPowerUnitData } from "./Columns";
import { Filter } from "../options/Filter";
import { Trash } from "../options/Trash";
import { CSVOptions } from "../options/CSVOptions";

export const List = memo(() => {
  // Data and fetching state
  const { powerUnitData } = useContext(VehiclesContext) as VehiclesContextType;

  // Table state
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // blurs content
  const [isRefetching, setIsRefetching] = useState(false); // used for progress bar
  const [rowCount, setRowCount] = useState(0);

  // Table column definitions
  const columnsPowerUnit = useMemo<MRT_ColumnDef<IPowerUnit>[]>(
    () => columnPowerUnitData,
    []
  );

  // TODO: clean this up
  useEffect(() => {

    console.log("UseEffect!");

    if (!powerUnitData.length) {
      setIsLoading(true);
    } else {
      setIsRefetching(true);
    }

    if (powerUnitData) {
      setRowCount(powerUnitData.length);
      setIsError(false);
      setIsLoading(false);
      setIsRefetching(false);
    } else {
      setIsError(true);
    }

  }, [powerUnitData]);

  return (
    <div className="table-container">
      <MaterialReactTable

        // Required Props
        data={powerUnitData}
        columns={columnsPowerUnit}

        // Disable the default column actions so that we can use our custom actions
        enableColumnActions={false}
        // Enable checkboxes for row selection
        enableRowSelection={true}

        // State
        rowCount={rowCount}
        state={{
          isLoading,
          showAlertBanner: isError,
          showProgressBars: isRefetching,
        }}

        // Render a custom options Bar (inclues search, filter, trash, and csv options)
        renderTopToolbar={({ table }) => (
          <Box
            sx={{
              display: "flex",
              padding: "10px 0px",
              backgroundColor: "white",
            }}
          >
            <MRT_GlobalFilterTextField table={table} />
            <Filter table={table} />
            <Trash />
            <CSVOptions />
          </Box>
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
            boxShadow: "none"
          }
        }}

        // Cell/Body container
        muiTableContainerProps={{
          sx: {
            border: "1px solid #DBDCDC",
            height: "60vh"
          }
        }}

        // Pagination
        muiBottomToolbarProps={{
          sx: {
            zIndex: 0, // resolve z-index conflict with sliding panel
            backgroundColor: "#F2F2F2"
          }
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
          sx: { backgroundColor: "#F2F2F2" },
        }}
        
      />
    </div>
  );
});

List.displayName = "List";