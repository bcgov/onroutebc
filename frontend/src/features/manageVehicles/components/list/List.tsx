import {
  memo,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import MaterialReactTable, {
  MRT_ColumnDef,
  MRT_GlobalFilterTextField,
  MRT_Row,
  MRT_TableInstance,
} from "material-react-table";
import "./List.scss";
import { Box, IconButton, Tooltip } from "@mui/material";
import { IPowerUnit, VehiclesContextType } from "../../types/managevehicles";
import { VehiclesContext } from "../../context/VehiclesContext";
import { PowerUnit_ColumnDef } from "./Columns";
import { Filter } from "../options/Filter";
import { Trash } from "../options/Trash";
import { CSVOptions } from "../options/CSVOptions";
import { Delete, Edit, ContentCopy } from "@mui/icons-material";
import { BC_BACKGROUND_LIGHT } from "../../../../constants/bcGovStyles";

/*
 *
 * The List component uses Material React Table (MRT)
 * For detailed documentation, see here:
 * https://www.material-react-table.com/docs/getting-started/usage
 *
 *
 */

export const List = memo(() => {
  // Data, fetched from backend API
  const { powerUnitData } = useContext(VehiclesContext) as VehiclesContextType;

  // Table state
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // blurs content
  const [isRefetching, setIsRefetching] = useState(false); // used for progress bar
  const [rowCount, setRowCount] = useState(0);

  // Column definitions for the table
  const columnsPowerUnit = useMemo<MRT_ColumnDef<IPowerUnit>[]>(
    () => PowerUnit_ColumnDef,
    []
  );

  // Needs a Refactor. The original code from MRT set the table state in a
  // try/catch block during the fetching of data
  // See https://www.material-react-table.com/docs/examples/remote
  useEffect(() => {
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

  const handleDeleteRow = useCallback((row: MRT_Row<IPowerUnit>) => {
    if (
      !confirm(`Are you sure you want to delete ${row.getValue("unitNumber")}`)
    ) {
      return;
    }
    //send api delete request here, then refetch or update local table data for re-render
  }, []);

  const handleSetEditingRow = useCallback((table: MRT_TableInstance<IPowerUnit>, row: SetStateAction<MRT_Row<IPowerUnit> | null>) => {
    table.setEditingRow(row);
  }, []);

  return (
    <div className="table-container">
      <MaterialReactTable
        // Required Props
        data={powerUnitData}
        columns={columnsPowerUnit}
        // State variables and actions
        rowCount={rowCount}
        state={{
          isLoading,
          showAlertBanner: isError,
          showProgressBars: isRefetching,
        }}
        // Disable the default column actions so that we can use our custom actions
        enableColumnActions={false}
        // Enable checkboxes for row selection
        enableRowSelection={true}
        // Row copy, delete, and edit options
        enableRowActions={true}
        positionActionsColumn="last"
        displayColumnDefOptions={{
          "mrt-row-actions": {
            header: "",
          },
        }}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Tooltip arrow placement="left" title="Edit">
              <IconButton onClick={useCallback(() => (table.setEditingRow(row)), [])}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="top" title="Copy">
              <IconButton onClick={() => handleSetEditingRow(table, row)}>
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
        // Render a custom options Bar (inclues search, filter, trash, and csv options)
        renderTopToolbar={useCallback(({ table } : { table : MRT_TableInstance<IPowerUnit>}) => (
          <Box
            sx={{
              display: "flex",
              padding: "10px 0px",
              backgroundColor: "white",
            }}
          >
            <MRT_GlobalFilterTextField table={table} />
            <Filter />
            <Trash />
            <CSVOptions />
          </Box>
        ),[])}
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
            height: "60vh",
          },
        }}
        // Pagination
        muiBottomToolbarProps={{
          sx: {
            zIndex: 0, // resolve z-index conflict with sliding panel
            backgroundColor: BC_BACKGROUND_LIGHT,
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
          sx: { backgroundColor: BC_BACKGROUND_LIGHT },
        }}
      />
    </div>
  );
});

List.displayName = "List";
