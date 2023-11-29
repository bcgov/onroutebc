import { BC_COLOURS } from "../../themes/bcGovStyles";

export const defaultTableStateOptions: any = {
};

export const defaultTableInitialStateOptions: any = {
  // property to enable global filter search box
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
  // global filter properties
  enableGlobalFilter: true,
  globalFilterFn: "contains",
  positionGlobalFilter: "left",
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

  // action column properties
  positionActionsColumn: "last",
  enableColumnActions: false,

  // row selection properties
  enableRowActions: true,
  enableRowSelection: true,

  // sticky table header properties
  //  docs recommend that a height is defined
  enableStickyHeader: true,
  muiTableContainerProps: {
    sx: {
      outline: "1px solid #DBDCDC",
      height: "calc(100vh - 475px)",
    },
  },

  // pagination properties
  enablePagination: false,
  selectAllMode: "page",
  enableTopToolbar: true,
  muiTableHeadRowProps: {
    sx: {
      backgroundColor: BC_COLOURS.bc_background_light_grey,
    },
  },
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
  muiTablePaperProps: {
    sx: {
      border: "none",
      boxShadow: "none",
    },
  },
  muiTopToolbarProps: { sx: { zIndex: 0 } }, // resolve z-index conflict with sliding panel
};
