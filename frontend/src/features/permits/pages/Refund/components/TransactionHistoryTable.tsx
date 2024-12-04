/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useMemo } from "react";

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
import { useFormContext } from "react-hook-form";
import { RefundFormData } from "../types/RefundFormData";
import { Checkbox, FormControlLabel } from "@mui/material";
import { requiredMessage } from "../../../../../common/helpers/validationMessages";

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
  const { register, watch, setValue, trigger } = formMethods;

  const isRowSelectable = (row: MRT_Row<RefundFormData>): boolean => {
    return (
      !isTransactionTypeRefund(row.original.transactionTypeId) &&
      !isZeroAmount(row.original.transactionAmount) &&
      totalRefundDue !== 0
    );
  };

  const columns = useMemo<MRT_ColumnDef<RefundFormData>[]>(
    () => [
      {
        accessorKey: "permitNumber",
        header: "Permit #",
        muiTableHeadCellProps: {
          className:
            "transaction-history-table__header transaction-history-table__header--permit-number",
        },
        muiTableBodyCellProps: {
          className:
            "transaction-history-table__data transaction-history-table__data--permit-number",
        },
        size: 150,
        enableSorting: false,
        enableColumnActions: false,
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
        muiTableHeadCellProps: {
          className:
            "transaction-history-table__header transaction-history-table__header--payment-method",
        },
        muiTableBodyCellProps: {
          className:
            "transaction-history-table__data transaction-history-table__data--payment-method",
        },
        size: 130,
        enableSorting: false,
        enableColumnActions: false,
      },
      {
        accessorFn: (originalRow) =>
          getDefaultRequiredVal(
            originalRow.transactionOrderNumber,
            originalRow.pgTransactionId,
          ),
        id: "providerTransactionId",
        header: "Provider Tran ID",
        muiTableHeadCellProps: {
          className:
            "transaction-history-table__header transaction-history-table__header--provider-transaction-id",
        },
        muiTableBodyCellProps: {
          className:
            "transaction-history-table__data transaction-history-table__data--provider-transaction-id",
        },
        size: 100,
        enableSorting: false,
        enableColumnActions: false,
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
        muiTableHeadCellProps: {
          className:
            "transaction-history-table__header transaction-history-table__header--amount",
        },
        muiTableBodyCellProps: {
          className:
            "transaction-history-table__data transaction-history-table__data--amount",
        },
        id: "transactionAmount",
        size: 50,
        enableSorting: false,
        enableColumnActions: false,
      },
      {
        id: "refundAmount",
        header: "Refund Amount (CAD)",
        muiTableHeadCellProps: {
          className:
            "transaction-history-table__header transaction-history-table__header--refund-amount",
        },
        muiTableBodyCellProps: {
          className:
            "transaction-history-table__data transaction-history-table__data--refund-amount",
        },
        size: 20,
        enableSorting: false,
        enableColumnActions: false,
        Cell: ({ cell }: { cell: MRT_Cell<RefundFormData> }) => {
          const rowIsSelected = cell.row.getIsSelected();

          // clear refundAmount when row is unselected
          useEffect(() => {
            if (!rowIsSelected) {
              setValue(`refundData.${cell.row.index}.refundAmount`, "");
            }
          }, [rowIsSelected, setValue, cell.row.index]);

          return (
            isRowSelectable(cell.row) && (
              <CustomFormComponent
                type="number"
                feature="refund-permit"
                className="transaction-history-table__input transaction-history-table__input--refund-amount"
                options={{
                  name: `refundData.${cell.row.index}.refundAmount`,
                  rules: { required: false },
                  width: "200px",
                  showOptionalLabel: false,
                }}
                disabled={!cell.row.getIsSelected()}
              />
            )
          );
        },
      },
      {
        id: "refundTransactionId",
        header: "Refund Tran ID",
        muiTableHeadCellProps: {
          className:
            "transaction-history-table__header transaction-history-table__header--refund-transaction-id",
        },
        muiTableBodyCellProps: {
          className:
            "transaction-history-table__data transaction-history-table__data--refund-transaction-id",
        },
        size: 20,
        enableSorting: false,
        enableColumnActions: false,
        Cell: ({ cell }: { cell: MRT_Cell<RefundFormData> }) => {
          const rowIsSelected = cell.row.getIsSelected();
          const refundAmount = watch(
            `refundData.${cell.row.index}.refundAmount`,
          );
          const chequeRefund = watch(
            `refundData.${cell.row.index}.chequeRefund`,
          );

          // clear refundTransactionId when refundAmount is empty or zero
          useEffect(() => {
            if (!refundAmount || Number(refundAmount) <= 0) {
              setValue(`refundData.${cell.row.index}.refundTransactionId`, "");
            }
          }, [refundAmount, cell.row.index, setValue]);

          // re-validate refundTransactionId when chequeRefund is checked/unchecked
          useEffect(() => {
            trigger(`refundData.${cell.row.index}.refundTransactionId`);
          }, [chequeRefund, cell.row.index, trigger]);

          // clear refundTransactionId when row is unselected
          useEffect(() => {
            if (!rowIsSelected) {
              setValue(`refundData.${cell.row.index}.refundTransactionId`, "");
            }
          }, [rowIsSelected, setValue, cell.row.index]);

          return (
            isRowSelectable(cell.row) && (
              <CustomFormComponent
                type="input"
                feature="refund-permit"
                className="transaction-history-table__input"
                options={{
                  name: `refundData.${cell.row.index}.refundTransactionId`,
                  rules: {
                    required: {
                      value: refundAmount !== "" && !chequeRefund,
                      message: requiredMessage(),
                    },
                  },
                  width: "200px",
                  showOptionalLabel: false,
                }}
                disabled={
                  !refundAmount || Number(refundAmount) <= 0 || chequeRefund
                }
              />
            )
          );
        },
      },
      {
        id: "chequeRefund",
        header: "Cheque Refund",
        muiTableHeadCellProps: {
          className:
            "transaction-history-table__header transaction-history-table__header--refund-cheque-refund",
        },
        muiTableBodyCellProps: {
          className:
            "transaction-history-table__data transaction-history-table__data--refund-cheque-refund",
        },
        size: 20,
        enableSorting: false,
        enableColumnActions: false,
        Cell: ({ cell }: { cell: MRT_Cell<RefundFormData> }) => {
          const refundAmount = watch(
            `refundData.${cell.row.index}.refundAmount`,
          );
          const refundTransactionId = watch(
            `refundData.${cell.row.index}.refundTransactionId`,
          );

          const rowIsSelected = cell.row.getIsSelected();

          // TODO this implementation is not currently working
          // set chequeRefund to false when row is unselected
          useEffect(() => {
            if (!rowIsSelected) {
              setValue(`refundData.${cell.row.index}.chequeRefund`, false);
            }
          }, [rowIsSelected, cell.row.index, setValue]);

          return (
            isRowSelectable(cell.row) && (
              <FormControlLabel
                control={
                  <Checkbox
                    className="cheque-refund-checkbox"
                    {...register(`refundData.${cell.row.index}.chequeRefund`)}
                    disabled={
                      !cell.row.getIsSelected() ||
                      Number(refundAmount) <= 0 ||
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
