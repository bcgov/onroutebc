import { useMemo } from "react";
import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

import "./SuspensionHistory.scss";
import {
  SUSPEND_ACTIVITY_TYPES,
  SuspendHistoryData,
} from "../../types/suspend";
import {
  applyWhenNotNullable,
  getDefaultRequiredVal,
} from "../../../../common/helpers/util";
import { DATE_FORMATS, toLocal } from "../../../../common/helpers/formatDate";
import {
  defaultTableInitialStateOptions,
  defaultTableOptions,
  defaultTableStateOptions,
} from "../../../../common/helpers/tableHelper";

export const SuspensionHistory = ({
  suspensionHistory,
}: {
  suspensionHistory: SuspendHistoryData[];
}) => {
  const columns = useMemo<MRT_ColumnDef<SuspendHistoryData>[]>(
    () => [
      {
        accessorKey: "userName",
        header: "IDIR",
        muiTableHeadCellProps: {
          className:
            "suspension-history__header suspension-history__header--user",
        },
        muiTableBodyCellProps: {
          className: "suspension-history__data suspension-history__data--user",
        },
        size: 50,
        enableSorting: false,
        enableColumnActions: false,
      },
      {
        accessorFn: (originalRow) => {
          return applyWhenNotNullable(
            (dateStr) => toLocal(dateStr, DATE_FORMATS.LONG),
            originalRow.suspendActivityDateTime,
            "",
          );
        },
        id: "suspendActivityDateTime",
        header: "Date",
        muiTableHeadCellProps: {
          className:
            "suspension-history__header suspension-history__header--date",
        },
        muiTableBodyCellProps: {
          className: "suspension-history__data suspension-history__data--date",
        },
        size: 120,
        enableSorting: false,
        enableColumnActions: false,
      },
      {
        accessorFn: (originalRow) =>
          getDefaultRequiredVal("", originalRow.comment),
        id: "comment",
        header: "Reason",
        muiTableHeadCellProps: {
          className:
            "suspension-history__header suspension-history__header--reason",
        },
        muiTableBodyCellProps: {
          className:
            "suspension-history__data suspension-history__data--reason",
        },
        size: 200,
        enableSorting: false,
        enableColumnActions: false,
      },
      {
        accessorFn: (originalRow) =>
          originalRow.suspendActivityType ===
          SUSPEND_ACTIVITY_TYPES.SUSPEND_COMPANY
            ? "Suspended"
            : "Suspension Removed",
        header: "Status",
        muiTableHeadCellProps: {
          className:
            "suspension-history__header suspension-history__header--status",
        },
        muiTableBodyCellProps: {
          className:
            "suspension-history__data suspension-history__data--status",
        },
        id: "suspendActivityType",
        size: 50,
        enableSorting: false,
        enableColumnActions: false,
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    ...defaultTableOptions,
    columns: columns,
    data: suspensionHistory,
    enableRowActions: false,
    enableGlobalFilter: false,
    enableTopToolbar: false,
    enableBottomToolbar: false,
    enableRowSelection: false,
    initialState: {
      ...defaultTableInitialStateOptions,
      showGlobalFilter: false,
    },
    state: {
      ...defaultTableStateOptions,
    },
    muiTablePaperProps: {
      className: "suspension-history",
    },
    muiTableContainerProps: {
      className: "suspension-history__table",
    },
  });

  return <MaterialReactTable table={table} />;
};
