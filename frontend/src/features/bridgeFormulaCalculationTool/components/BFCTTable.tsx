// TODO delete this file
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useMemo, useState } from "react";

import {
  MRT_Cell,
  MRT_ColumnDef,
  MRT_Row,
  MRT_RowSelectionState,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

import {
  applyWhenNotNullable,
  getDefaultRequiredVal,
} from "../../../common/helpers/util";

import {
  defaultTableInitialStateOptions,
  defaultTableOptions,
  defaultTableStateOptions,
} from "../../../common/helpers/tableHelper";
import { CustomFormComponent } from "../../../common/components/form/CustomFormComponents";
import {
  FieldArrayWithId,
  useFieldArray,
  useFormContext,
} from "react-hook-form";
import { Checkbox, FormControlLabel } from "@mui/material";
import { requiredMessage } from "../../../common/helpers/validationMessages";
import { AxleUnit } from "../types/AxleUnit";

export const BFCTTable = () => {
  const formMethods = useFormContext();
  const { control, register, watch, setValue, trigger, getValues } =
    formMethods;
  const { fields } = useFieldArray({ control, name: "axleUnits" });

  const axleUnits = getValues("axleUnits");

  const columns = useMemo<MRT_ColumnDef<AxleUnit>[]>(
    () => [
      {
        accessorKey: "property",
        header: "Property",
      },
      ...getValues("axleUnits").map(
        (
          field: FieldArrayWithId<
            { axleUnits: AxleUnit[] },
            "axleUnits",
            "id"
          >[],
          index: number,
        ) => ({
          accessorKey: `Axle ${index + 1}`,
          header: `Axle ${index + 1}`,
        }),
      ),
    ],
    [],
  );

  const rowData = [
    {
      property: "numberOfAxles",
      ...Object.fromEntries(
        axleUnits.map((unit, index) => [
          `Axle ${index + 1}`,
          unit.numberOfAxles,
        ]),
      ),
    },
    {
      property: "axleSpread",
      ...Object.fromEntries(
        axleUnits.map((unit, index) => [`Axle ${index + 1}`, unit.axleSpread]),
      ),
    },
    {
      property: "axleUnitWeight",
      ...Object.fromEntries(
        axleUnits.map((unit, index) => [
          `Axle ${index + 1}`,
          unit.axleUnitWeight,
        ]),
      ),
    },
  ];

  const table = useMaterialReactTable({
    ...defaultTableOptions,
    columns: columns,
    data: validTransactionHistory,
    onRowSelectionChange: setRowSelection,
    state: { ...defaultTableStateOptions, rowSelection },
    initialState: {
      ...defaultTableInitialStateOptions,
      showGlobalFilter: false,
      columnVisibility: { chequeRefund: totalRefundDue !== 0 },
    },
    getRowId: (row: RefundFormData) => row.permitNumber,
    displayColumnDefOptions: {
      "mrt-row-select": {
        size: 10,
        header: "",
      },
    },
    enableRowActions: false,
    enableGlobalFilter: false,
    enableTopToolbar: false,
    enableBottomToolbar: false,
    enableRowSelection: (row: MRT_Row<RefundFormData>) => isRowSelectable(row),
    enableSelectAll: false,
    muiSelectCheckboxProps: ({ row }: { row: MRT_Row<RefundFormData> }) => ({
      className: `transaction-history-table__checkbox ${!isRowSelectable(row) && "transaction-history-table__checkbox--disabled"}`,
    }),
    muiTablePaperProps: {
      className: "transaction-history-table",
    },
    muiTableContainerProps: {
      className: "transaction-history-table__container",
    },
    muiTableBodyRowProps: ({ row }) => ({
      className: `transaction-history-table__row ${row.getIsSelected() && "transaction-history-table__row--selected"}`,
    }),
  });

  return (
    <>
      <MaterialReactTable table={table} />
    </>
  );
};
