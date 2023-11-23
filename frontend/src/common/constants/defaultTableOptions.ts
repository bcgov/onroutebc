import { BC_COLOURS } from "../../themes/bcGovStyles";

export const defaultTableOptions:any = {
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
    enableColumnActions: false,
    enableRowActions: true,
    enableStickyHeader: true,
    enablePagination: false,
    enableTopToolbar: false,
    enableBottomToolbar: false,
    enableSortingRemoval: false,
    globalFilterFn: "contains",
    muiBottomToolbarProps: {
        sx: {
          zIndex: 0, // resolve z-index conflict with sliding panel
          backgroundColor: BC_COLOURS.bc_background_light_grey,
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
    muiTopToolbarProps: { sx: { zIndex: 0 } }, // resolve z-index conflict with sliding panel
    positionActionsColumn: "last",
    positionGlobalFilter: "left",
    selectAllMode: "page",
};
