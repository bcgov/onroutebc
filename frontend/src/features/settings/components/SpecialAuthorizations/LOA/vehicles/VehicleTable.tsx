import { useCallback } from "react";
import {
  MRT_GlobalFilterTextField,
  MRT_Row,
  MRT_RowSelectionState,
  MRT_TableInstance,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

import "./VehicleTable.scss";
import { LOAVehicleColumnDefinition } from "./LOAVehicleColumnDefinition";
import { NoRecordsFound } from "../../../../../../common/components/table/NoRecordsFound";
import { LOAVehicle } from "../../../../types/LOAVehicle";
import {
  defaultTableOptions,
  defaultTableInitialStateOptions,
  defaultTableStateOptions,
} from "../../../../../../common/helpers/tableHelper";

export const VehicleTable = ({
  vehicles,
  enablePagination = false,
  selectedVehicles,
  onUpdateSelection,
  enableTopToolbar = false,
  hasError,
}: {
  vehicles: LOAVehicle[];
  enablePagination?: boolean;
  selectedVehicles?: {
    [id: string]: boolean;
  };
  onUpdateSelection?: (selectedVehicles: { [id: string]: boolean; }) => void;
  enableTopToolbar?: boolean;
  hasError?: boolean;
}) => {
  const enableRowSelection = Boolean(onUpdateSelection);
  const enableFilter = Boolean(enableTopToolbar);

  const selectionConfig = enableRowSelection ? {
    enableRowSelection: true,
    muiSelectCheckboxProps: {
      className: `loa-vehicle-table__checkbox ${hasError ? "loa-vehicle-table__checkbox--error" : ""}`,
    },
    onRowSelectionChange: useCallback(
      (updaterFn?: ((old: MRT_RowSelectionState) => MRT_RowSelectionState)) => {
        if (updaterFn && onUpdateSelection && selectedVehicles) {
          onUpdateSelection(updaterFn(selectedVehicles));
        }
      },
      [selectedVehicles, onUpdateSelection]
    ),
  } : {
    enableRowSelection: false,
  };

  const filterConfig = enableFilter ? {
    enableTopToolbar: true,
    filterFns: {
      filterByVINAndPlate: (row: MRT_Row<any>, columnId: string, filterValue: string) => {
        return (columnId === "plate" && row.getValue<string>(columnId).includes(filterValue))
          || (columnId === "vin" && row.getValue<string>(columnId).endsWith(filterValue));
      },
    },
    globalFilterFn: enableTopToolbar ? "filterByVINAndPlate" : undefined,
    renderTopToolbar: useCallback(
      ({ table }: { table: MRT_TableInstance<LOAVehicle> }) => enableFilter ? (
        <div className="table-container__top-toolbar">
          <div className="loa-vehicle-table__search">
            <div className="search-label">
              Search VIN <span className="search-label--light">(last 6 digits)</span> or Plate
            </div>

            <MRT_GlobalFilterTextField
              className="search-input"
              InputProps={{
                className: "search-input__input-container",
                endAdornment: null,
              }}
              inputProps={{
                className: "search-input__input-textfield",
              }}
              table={table}
            />
          </div>
        </div>
      ) : null,
      [enableFilter],
    ),
  } : {
    enableTopToolbar: false,
  };

  const initialState = enableTopToolbar ? {
    ...defaultTableInitialStateOptions,
  } : {
    showGlobalFilter: false,
  };

  const state = enableRowSelection ? {
    ...defaultTableStateOptions,
    rowSelection: selectedVehicles,
  } : {
    ...defaultTableStateOptions,
  };

  const table = useMaterialReactTable({
    ...defaultTableOptions,
    data: vehicles,
    columns: LOAVehicleColumnDefinition,
    initialState,
    state,
    ...filterConfig,
    ...selectionConfig,
    enablePagination,
    enableBottomToolbar: enablePagination,
    enableSorting: false,
    enableRowActions: false,
    getRowId: (originalRow) => {
      return `${originalRow.vehicleType}-${originalRow.vehicleId}`;
    },
    renderEmptyRowsFallback: () => <NoRecordsFound />,
    muiTableContainerProps: {
      className: "loa-vehicle-table__container",
    },
    muiTablePaperProps: {
      className: "loa-vehicle-table__paper-container",
    },
  });

  return (
    <div className="loa-vehicle-table table-container">
      <MaterialReactTable table={table} />
    </div>
  );
};
