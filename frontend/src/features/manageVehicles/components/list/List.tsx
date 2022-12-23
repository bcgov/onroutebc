import { useContext, useMemo } from "react";
import MaterialReactTable, {
  MRT_ColumnDef,
  MRT_GlobalFilterTextField,
} from "material-react-table";
import "./List.scss";
import { Box } from "@mui/material";
import {
  IPowerUnit,
  ManageVehiclesContextType,
} from "../../@types/managevehicles";
import { ManageVehiclesContext } from "../../context/ManageVehiclesContext";
import { columnPowerUnitData } from "./Columns";
import { Filter } from "../options/Filter";
import { Trash } from "../options/Trash";
import { CSVOptions } from "../options/CSVOptions";

export const List = () => {

  // data and fetching state
  const { powerUnitData, isError, isLoading, isRefetching, rowCount } = useContext(
    ManageVehiclesContext
  ) as ManageVehiclesContextType;

  // table column definitions
  const columnsPowerUnit = useMemo<MRT_ColumnDef<IPowerUnit>[]>(
    () => columnPowerUnitData,
    []
  );

  return (
    <div className="table-container">
      <MaterialReactTable
        data={powerUnitData}
        columns={columnsPowerUnit}
        enableColumnActions={false}
        enableRowSelection={true}
        muiTopToolbarProps={{ sx: { zIndex: 0 } }} // resolve z-index conflict with sliding panel
        muiBottomToolbarProps={{ sx: { zIndex: 0 } }} // resolve z-index conflict with sliding panel
        muiToolbarAlertBannerProps={
          isError
            ? {
                color: "error",
                children: "Error loading data",
              }
            : undefined
        }
        rowCount={rowCount}
        state={{
          isLoading: isLoading,
          showAlertBanner: isError,
          showProgressBars: isRefetching,
        }}

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
          sx: { backgroundColor: "lightGrey" },
        }}

        // Custom options
        renderTopToolbar={({ table }) => (
          <Box
            sx={{
              display: "flex",
              padding: "10px 0px",
              backgroundColor: "#F2F2F2",
            }}
          >
            <MRT_GlobalFilterTextField table={table} />
            <Filter table={table} />
            <Trash />
            <CSVOptions />
          </Box>
        )}
      />
    </div>
  );
};
