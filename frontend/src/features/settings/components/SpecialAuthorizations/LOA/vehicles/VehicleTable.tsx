import { useCallback } from "react";
import {
  MRT_GlobalFilterTextField,
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
  enablePagination,
  selectedVehicles,
  onUpdateSelection,
  enableTopToolbar,
}: {
  vehicles: LOAVehicle[];
  enablePagination?: boolean;
  selectedVehicles?: {
    [id: string]: boolean;
  };
  onUpdateSelection?: (selectedVehicles: { [id: string]: boolean; }) => void;
  enableTopToolbar?: boolean;
}) => {
  const table = useMaterialReactTable({
    ...defaultTableOptions,
    enablePagination,
    enableBottomToolbar: enablePagination,
    enableSorting: false,
    enableRowSelection: Boolean(onUpdateSelection),
    data: vehicles,
    columns: LOAVehicleColumnDefinition,
    initialState: {
      ...defaultTableInitialStateOptions,
    },
    state: {
      ...defaultTableStateOptions,
      rowSelection: selectedVehicles,
    },
    getRowId: (originalRow) => {
      return `${originalRow.vehicleType}-${originalRow.vehicleId}`;
    },
    onRowSelectionChange: useCallback((updaterFn?: ((old: MRT_RowSelectionState) => MRT_RowSelectionState)) => {
      if (updaterFn && onUpdateSelection && selectedVehicles) {
        onUpdateSelection(updaterFn(selectedVehicles));
      }
    }, [selectedVehicles]),
    renderEmptyRowsFallback: () => <NoRecordsFound />,
    filterFns: enableTopToolbar ? {
      filterByVINAndPlate: (row, columnId, filterValue) => {
        return (columnId === "plate" && row.getValue<string>(columnId).includes(filterValue))
          || (columnId === "vin" && row.getValue<string>(columnId).endsWith(filterValue));
      },
    } : undefined,
    globalFilterFn: enableTopToolbar ? "filterByVINAndPlate" : undefined,
    renderTopToolbar: useCallback(
      ({ table }: { table: MRT_TableInstance<LOAVehicle> }) => enableTopToolbar ? (
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
      [enableTopToolbar],
    ),
  });

  return (
    <div className="loa-vehicle-table table-container">
      <MaterialReactTable table={table} />
    </div>
  );
};
