import { BC_COLOURS } from "../../themes/bcGovStyles";


export const defaultTableStateOptions: any = {

};

export const defaultTableInitialStateOptions: any = {
  showGlobalFilter: true,
};

export const defaultTableOptions: any = {
  defaultColumn: {
    maxSize: 200, //allow columns to get larger than default
    minSize: 25,
    size: 50,
  },
  displayColumnDefOptions: {
    "mrt-row-actions": {
      header: "",
    },
  },
  enableGlobalFilter: true,
  globalFilterFn: "contains",
  positionGlobalFilter: "left",
  positionActionsColumn: "last",
  enableColumnActions: false,
  enableRowActions: true,
  enableRowSelection: true,
  enableStickyHeader: true,
  enablePagination: false,
  selectAllMode: "page",
  enableTopToolbar: true,
  enableBottomToolbar: true,
  enableSortingRemoval: false,
  muiBottomToolbarProps: {
    sx: {
      zIndex: 0, // resolve z-index conflict with sliding panel
      backgroundColor: BC_COLOURS.bc_background_light_grey,
    },
  },
  muiPaginationProps: {
    color: 'secondary',
    rowsPerPageOptions: [10, 20, 30, 40, 50],
    shape: 'rounded',
    variant: 'outlined',
  },
  muiTableContainerProps: {
    sx: {
      outline: "1px solid #DBDCDC",
      height: "calc(100vh - 475px)",
    },
  },
  muiTableHeadRowProps: {
    sx: {
      backgroundColor: BC_COLOURS.bc_background_light_grey,
    },
  },
  muiTablePaperProps: {
    sx: {
      border: "none",
      boxShadow: "none",
    },
  },
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
  muiTopToolbarProps: { sx: { zIndex: 0 } }, // resolve z-index conflict with sliding panel
  //positionActionsColumn: "last",
  //positionGlobalFilter: "left",
  //selectAllMode: "page",

};
