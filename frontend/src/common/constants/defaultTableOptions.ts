import { Row } from "@tanstack/table-core/build/lib/types";
import { BC_COLOURS } from "../../themes/bcGovStyles";
import { DATE_FORMATS, toLocal, utcToLocalDayjs } from "../helpers/formatDate";
import { applyWhenNotNullable } from "../helpers/util";
import { Permit } from "../../features/permits/types/permit";

/**
 * Format a given datetime string to a format that we can display
 * @param rawDateTime 
 * @returns datetime string for display or "NA" if invalid date given
 */
export const formatCellValuetoDatetime = (rawDateTime: string | null | undefined) => {
  return applyWhenNotNullable(
    (dt) => toLocal(dt, DATE_FORMATS.DATEONLY_ABBR_MONTH),
    rawDateTime,
    "NA",
  );
};

/**
 * Take 2 rows and the given datetime columnId and return its sort value
 * @param rowA - the A row being compared
 * @param rowB - the B row being compared
 * @param columnId - should be the column id of the date column
 * @returns -1 if A < B, 0 if A == B and 1 if A > B
 */
export const dateTimeStringSortingFn = (rowA: Row<Permit>, rowB: Row<Permit>, columnId: string) => {
  const day1 = utcToLocalDayjs(rowA.getValue(columnId));
  const day2 = utcToLocalDayjs(rowB.getValue(columnId));
  let sortVal = 0;
  if (day1.isBefore(day2)) sortVal = -1;
  if (day1.isAfter(day2)) sortVal = 1;
  return sortVal;
};

export const defaultTableStateOptions = {};

export const defaultTableInitialStateOptions = {
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

  // prevent sorting by more then one column
  enableMultiSort: false,

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
  enableBottomToolbar: false, // hide pagination for now
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
