import { memo, useCallback, useContext, useEffect, useMemo, useState } from "react";
import MaterialReactTable, {
  MRT_ColumnDef,
  MRT_GlobalFilterTextField,
  MRT_Row,
} from "material-react-table";
import "./List.scss";
import { Box, IconButton, Tooltip } from "@mui/material";
import { IPowerUnit, VehiclesContextType } from "../../@types/managevehicles";
import { VehiclesContext } from "../../context/VehiclesContext";
import { columnPowerUnitData } from "./Columns";
import { Filter } from "../options/Filter";
import { Trash } from "../options/Trash";
import { CSVOptions } from "../options/CSVOptions";

import { Delete, Edit, ContentCopy } from '@mui/icons-material';
import { ColumnFiltersState } from "@tanstack/table-core";
import { FilterList } from "./FilterList";

export const List = memo(() => {
  // Data and fetching state
  const { powerUnitData } = useContext(VehiclesContext) as VehiclesContextType;

  // Table state
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // blurs content
  const [isRefetching, setIsRefetching] = useState(false); // used for progress bar
  const [rowCount, setRowCount] = useState(0);

  // Filters
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Table column definitions
  const columnsPowerUnit = useMemo<MRT_ColumnDef<IPowerUnit>[]>(
    () => columnPowerUnitData,
    []
  );

  // TODO: clean this up
  // See https://www.material-react-table.com/docs/examples/remote
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

  

  const handleDeleteRow = useCallback(
    (row: MRT_Row<IPowerUnit>) => {
      if (
        !confirm(`Are you sure you want to delete ${row.getValue('unitNumber')}`)
      ) {
        return;
      }
      //send api delete request here, then refetch or update local table data for re-render
      //tableData.splice(row.index, 1);
      //setTableData([...tableData]);
    },
    [],
  );
  
  return (
    <div className="table-container">
      <MaterialReactTable

        // Required Props
        data={powerUnitData}
        columns={columnsPowerUnit}

        // Column widths
        defaultColumn={{
          maxSize: 200, //allow columns to get larger than default
          size: 50, //make columns wider by default
        }}

        // Disable the default column actions so that we can use our custom actions
        enableColumnActions={false}
        // Enable checkboxes for row selection
        enableRowSelection={true}

    
        // Row copy, delete, and edit options
        enableRowActions={true}
        positionActionsColumn="last"
        displayColumnDefOptions={{
          'mrt-row-actions': {
            header: ""
          },
        }}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: 'flex', justifyContent: "flex-end" }}>
            <Tooltip arrow placement="left" title="Edit">
              <IconButton onClick={() => table.setEditingRow(row)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="top" title="Copy">
              <IconButton onClick={() => table.setEditingRow(row)}>
                <ContentCopy />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="top" title="Delete">
              <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        

        // State
        rowCount={rowCount}
        state={{
          isLoading,
          showAlertBanner: isError,
          showProgressBars: isRefetching,
          columnFilters
        }}

        onColumnFiltersChange={setColumnFilters}

        // Render a custom options Bar (inclues search, filter, trash, and csv options)
        renderTopToolbar={({ table }) => (
          <>
          <Box
            sx={{
              display: "flex",
              padding: "10px 0px",
              backgroundColor: "white",
            }}
          >
            <MRT_GlobalFilterTextField table={table} />
            <Filter table={table} filters={columnFilters}/>
            <Trash />
            <CSVOptions />
          </Box>
          <FilterList table={table} filters={columnFilters}/>
          </>
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
            outline: "1px solid #DBDCDC",
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