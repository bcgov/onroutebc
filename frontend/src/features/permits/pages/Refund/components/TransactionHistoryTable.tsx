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

import "./TransactionHistoryTable.scss";
import { PermitHistory } from "../../../types/PermitHistory";
import { getPaymentMethod } from "../../../../../common/types/paymentMethods";
import { isValidTransaction } from "../../../helpers/payment";
import {
  applyWhenNotNullable,
  getDefaultRequiredVal,
} from "../../../../../common/helpers/util";

import {
  feeSummaryDisplayText,
  isTransactionTypeRefund,
  isZeroAmount,
} from "../../../helpers/feeSummary";

import {
  defaultTableInitialStateOptions,
  defaultTableOptions,
  defaultTableStateOptions,
} from "../../../../../common/helpers/tableHelper";
import { CustomFormComponent } from "../../../../../common/components/form/CustomFormComponents";
import { Controller, useFormContext } from "react-hook-form";
import { RefundFormData } from "../types/RefundFormData";
import { Checkbox, FormControlLabel, FormHelperText } from "@mui/material";
import { requiredMessage } from "../../../../../common/helpers/validationMessages";
import { NumberInput } from "../../../../../common/components/form/subFormComponents/NumberInput";
import { convertToNumberIfValid } from "../../../../../common/helpers/numeric/convertToNumberIfValid";

export const TransactionHistoryTable = ({
  permitHistory,
  totalRefundDue,
  rowSelection,
  setRowSelection,
}: {
  permitHistory: PermitHistory[];
  totalRefundDue: number;
  rowSelection: MRT_RowSelectionState;
  setRowSelection: (rowSelection: MRT_RowSelectionState) => void;
}) => {
  const validTransactionHistory = permitHistory.filter((history) =>
    isValidTransaction(history.paymentMethodTypeCode, history.pgApproved),
  );

  const formMethods = useFormContext();
  const {
    register,
    getValues,
    setValue,
    trigger,
    control,
    watch,
    getFieldState,
  } = formMethods;

  const isRowSelectable = (row: MRT_Row<RefundFormData>): boolean => {
    return (
      !isTransactionTypeRefund(row.original.transactionTypeId) &&
      !isZeroAmount(row.original.transactionAmount) &&
      totalRefundDue !== 0
    );
  };

  const refundData = watch("refundData");

  const columns = useMemo<MRT_ColumnDef<RefundFormData>[]>(
    () => [
      {
        accessorKey: "permitNumber",
        header: "Permit #",
        size: 150,
        enableSorting: false,
        enableColumnActions: false,
        Cell: ({ cell }: { cell: MRT_Cell<RefundFormData> }) => (
          <div className="cell__inner ">
            <div className="cell__value">{cell.getValue<string>()}</div>
          </div>
        ),
      },
      {
        accessorFn: (originalRow) => {
          return getPaymentMethod(
            originalRow.paymentMethodTypeCode,
            originalRow.paymentCardTypeCode,
          );
        },
        id: "paymentMethod",
        header: "Payment Method",
        size: 130,
        enableSorting: false,
        enableColumnActions: false,
        Cell: ({ cell }: { cell: MRT_Cell<RefundFormData> }) => (
          <div className="cell__inner ">
            <div className="cell__value">{cell.getValue<string>()}</div>
          </div>
        ),
      },
      {
        accessorFn: (originalRow) =>
          getDefaultRequiredVal(
            originalRow.transactionOrderNumber,
            originalRow.pgTransactionId,
          ),
        id: "providerTransactionId",
        header: "Provider Tran ID",
        size: 100,
        enableSorting: false,
        enableColumnActions: false,
        Cell: ({ cell }: { cell: MRT_Cell<RefundFormData> }) => (
          <div className="cell__inner ">
            <div className="cell__value">{cell.getValue<string>()}</div>
          </div>
        ),
      },
      {
        accessorFn: (originalRow) => {
          const amount = isTransactionTypeRefund(originalRow.transactionTypeId)
            ? -1 * originalRow.transactionAmount
            : originalRow.transactionAmount;

          return feeSummaryDisplayText(
            applyWhenNotNullable((val) => `${val}`, amount),
          );
        },
        header: "Amount (CAD)",
        id: "transactionAmount",
        size: 50,
        enableSorting: false,
        enableColumnActions: false,
        Cell: ({ cell }: { cell: MRT_Cell<RefundFormData> }) => (
          <div className="cell__inner ">
            <div className="cell__value">{cell.getValue<string>()}</div>
          </div>
        ),
      },
      {
        id: "refundAmount",
        header: "Refund Amount (CAD)",
        size: 20,
        enableSorting: false,
        enableColumnActions: false,
        Cell: ({ cell }: { cell: MRT_Cell<RefundFormData> }) => {
          const rowIsSelected = cell.row.getIsSelected();
          const fieldIndex = cell.row.index;
          const fieldName = `refundData.${fieldIndex}.refundAmount` as const;
          const fieldValue = refundData[fieldIndex].refundAmount;

          // clear refundAmount when row is unselected
          useEffect(() => {
            !rowIsSelected && setValue(fieldName, "");
          }, [rowIsSelected, setValue, fieldIndex]);

          return (
            isRowSelectable(cell.row) && (
              <div className="cell__inner">
                <Controller
                  name={fieldName}
                  control={control}
                  rules={{
                    required: false,
                  }}
                  render={({ fieldState: { error } }) => (
                    <NumberInput
                      classes={{
                        root: "transaction-history-table__input-container",
                      }}
                      inputProps={{
                        className: "transaction-history-table__input",
                        value: fieldValue,
                        onChange: ({ target: { value } }) => {
                          setValue(fieldName, value);
                        },
                        disabled: !rowIsSelected,
                      }}
                      helperText={
                        error?.message
                          ? {
                              errors: [error.message],
                            }
                          : undefined
                      }
                    />
                  )}
                />
              </div>
              // <CustomFormComponent
              //   type="number"
              //   feature="refund-permit"
              //   className="transaction-history-table__input"
              //   options={{
              //     name: fieldName,
              //     rules: { required: false },
              //     width: "200px",
              //     showOptionalLabel: false,
              //   }}
              //   disabled={!rowIsSelected}
              // />
            )
          );
        },
      },
      {
        id: "refundTransactionId",
        header: "Refund Tran ID",
        // muiTableHeadCellProps: {
        //   className:
        //     "transaction-history-table__header transaction-history-table__header--refund-transaction-id",
        // },
        muiTableBodyCellProps: {
          className:
            "transaction-history-table__cell transaction-history-table__cell--refund-transaction-id",
        },
        size: 20,
        enableSorting: false,
        enableColumnActions: false,
        Cell: ({ cell }: { cell: MRT_Cell<RefundFormData> }) => {
          const rowIsSelected = cell.row.getIsSelected();
          const fieldIndex = cell.row.index;
          const fieldName =
            `refundData.${fieldIndex}.refundTransactionId` as const;
          const fieldValue = refundData[fieldIndex].refundTransactionId;
          const { error: fieldError } = getFieldState(fieldName);

          // must use getValues to access fields outside of the one we are rendering in order to get latest values
          const refundAmount = getValues(
            `refundData.${fieldIndex}.refundAmount`,
          );
          const chequeRefund = getValues(
            `refundData.${fieldIndex}.chequeRefund`,
          );

          // clear refundTransactionId when refundAmount is empty or zero
          useEffect(() => {
            if (!refundAmount || Number(refundAmount) <= 0) {
              setValue(fieldName, "");
            }
          }, [refundAmount, fieldIndex, setValue]);

          // re-validate refundTransactionId when chequeRefund is checked/unchecked
          useEffect(() => {
            trigger(fieldName);
          }, [chequeRefund, fieldIndex, trigger]);

          // clear refundTransactionId when row is unselected
          useEffect(() => {
            !rowIsSelected && setValue(fieldName, "");
          }, [rowIsSelected, setValue, fieldIndex]);

          return (
            isRowSelectable(cell.row) && (
              <div>
                <Controller
                  name={fieldName}
                  control={control}
                  rules={{
                    required: {
                      value: refundAmount !== "" && !chequeRefund,
                      message: requiredMessage(),
                    },
                  }}
                  render={({ fieldState: { error } }) => (
                    <NumberInput
                      classes={{
                        root: "transaction-history-table__input-container",
                      }}
                      inputProps={{
                        value: fieldValue,
                        onChange: ({ target: { value } }) =>
                          setValue(fieldName, value),
                        disabled:
                          !refundAmount ||
                          Number(refundAmount) <= 0 ||
                          chequeRefund,
                      }}
                      helperText={
                        error?.message
                          ? {
                              errors: [error.message],
                            }
                          : undefined
                      }
                    />
                  )}
                />
                {/* {fieldError && (
                  <FormHelperText
                    key={fieldError.message}
                    className="number-input__helper-text number-input__helper-text--error"
                    error={true}
                  >
                    {fieldError.message}
                  </FormHelperText>
                )} */}
              </div>
              // <CustomFormComponent
              //   type="input"
              //   feature="refund-permit"
              //   className="transaction-history-table__input"
              //   options={{
              //     name: `refundData.${cell.row.index}.refundTransactionId`,
              //     rules: {
              //       required: {
              //         value: refundAmount !== "" && !chequeRefund,
              //         message: requiredMessage(),
              //       },
              //     },
              //     width: "200px",
              //     showOptionalLabel: false,
              //   }}
              //   disabled={
              //     !refundAmount || Number(refundAmount) <= 0 || chequeRefund
              //   }
              // />
            )
          );
        },
      },
      {
        id: "chequeRefund",
        header: "",
        // muiTableHeadCellProps: {
        //   className:
        //     "transaction-history-table__header transaction-history-table__header--refund-cheque-refund",
        // },
        muiTableBodyCellProps: {
          className:
            "transaction-history-table__cell transaction-history-table__cell--refund-cheque-refund",
        },
        size: 20,
        enableSorting: false,
        enableColumnActions: false,
        Cell: ({ cell }: { cell: MRT_Cell<RefundFormData> }) => {
          const fieldIndex = cell.row.index;
          const fieldName = `refundData.${fieldIndex}.chequeRefund` as const;
          const fieldValue = refundData[fieldIndex].chequeRefund;
          // must use getValues to access fields outside of the one we are rendering in order to get latest values
          const refundAmount = getValues(
            `refundData.${fieldIndex}.refundAmount`,
          );
          const refundTransactionId = getValues(
            `refundData.${fieldIndex}.refundTransactionId`,
          );
          const rowIsSelected = cell.row.getIsSelected();

          // local state necessary for 'chequeRefund' checkbox column to allow setting it to false when row is unselected
          const [isChecked, setIsChecked] = useState(fieldValue);

          // sync react-hook-form state when local state changes
          useEffect(() => {
            setValue(fieldName, isChecked);
          }, [setValue, isChecked]);

          // clear chequeRefund when row is unselected
          useEffect(() => {
            !rowIsSelected && setIsChecked(false);
          }, [rowIsSelected]);

          // clear chequeRefund when refundAmount is cleared
          useEffect(() => {
            if (refundAmount === "") {
              setIsChecked(false);
            }
          }, [refundAmount]);

          return (
            isRowSelectable(cell.row) && (
              <div className="cell__inner">
                <FormControlLabel
                  control={
                    <Checkbox
                      className="cheque-refund-checkbox"
                      {...register(fieldName)}
                      checked={isChecked}
                      onChange={(e) => setIsChecked(e.target.checked)}
                      disabled={
                        !rowIsSelected ||
                        refundAmount === "" ||
                        refundTransactionId !== ""
                      }
                    />
                  }
                  label="Cheque Refund"
                  classes={{
                    root: "cheque-refund-label",
                    disabled: "cheque-refund-label--disabled",
                  }}
                />
              </div>
            )
          );
        },
      },
    ],
    [],
  );

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
    muiTableHeadProps: {
      className: "transaction-history-table__header",
    },
    muiTableHeadCellProps: {
      className:
        "transaction-history-table__cell transaction-history-table__cell--header",
    },
    muiTableBodyRowProps: ({ row }) => ({
      className: `transaction-history-table__row ${row.getIsSelected() && "transaction-history-table__row--selected"}`,
    }),
    muiTableBodyCellProps: {
      className:
        "transaction-history-table__cell transaction-history-table__cell--body",
    },
  });

  return (
    <>
      <MaterialReactTable table={table} />
    </>
  );
};
