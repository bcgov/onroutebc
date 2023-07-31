import { BC_COLOURS } from "../../../../themes/bcGovStyles";

export const COMMON_TABLE_STYLE = {
  muiTablePaperProps: {
    sx: {
      border: "none",
      boxShadow: "none",
    },
  },
  // Column widths
  defaultColumn: {
    size: 50,
    maxSize: 200,
    minSize: 25,
  },
  // Cell/Body container
  muiTableContainerProps: {
    sx: {
      height: "calc(100vh - 475px)",
      outline: "1px solid #DBDCDC",
    },
  },
  // Pagination
  muiBottomToolbarProps: {
    sx: {
      backgroundColor: BC_COLOURS.bc_background_light_grey,
      zIndex: 0,
    },
  },
  // Alert banner

  // Top toolbar
  muiTopToolbarProps: { sx: { zIndex: 0 } },
  // Search Bar
  positionGlobalFilter: "left",
  initialState: { showGlobalFilter: true }, //show the search bar by default
  muiSearchTextFieldProps: {
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
  },
  // Row Header
  muiTableHeadRowProps: {
    sx: {
      backgroundColor: BC_COLOURS.bc_background_light_grey,
    },
  },
};
