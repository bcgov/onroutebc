/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMemo } from "react";

import {
  MRT_Cell,
  MRT_ColumnDef,
  MRT_Row,
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
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import {
  MultiplePaymentMethodRefundFormData,
  MultiplePaymentMethodRefundRowData,
  PermitHistoryWithRefund,
} from "../types/RefundFormData";
import { Button, Checkbox, FormControlLabel } from "@mui/material";

export const TransactionHistoryTable = ({
  permitHistory,
}: {
  permitHistory: PermitHistory[];
}) => {
  const validTransactionHistory = permitHistory.filter((history) =>
    isValidTransaction(history.paymentMethodTypeCode, history.pgApproved),
  );

  const formMethods = useForm<MultiplePaymentMethodRefundFormData>();

  const { handleSubmit } = formMethods;

  const onSubmit = (data: FieldValues) => {
    console.log(data);
  };

  const columns = useMemo<MRT_ColumnDef<PermitHistoryWithRefund>[]>(
    () => [
      {
        accessorKey: "permitNumber",
        header: "Permit #",
        muiTableHeadCellProps: {
          className:
            "transaction-history-table__header transaction-history-table__header--permit",
        },
        muiTableBodyCellProps: {
          className:
            "transaction-history-table__data transaction-history-table__data--permit",
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
            "transaction-history-table__header transaction-history-table__header--payment",
        },
        muiTableBodyCellProps: {
          className:
            "transaction-history-table__data transaction-history-table__data--payment",
        },
        size: 200,
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
            "transaction-history-table__header transaction-history-table__header--transaction",
        },
        muiTableBodyCellProps: {
          className:
            "transaction-history-table__data transaction-history-table__data--transaction",
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
          align: "right",
        },
        muiTableBodyCellProps: {
          className:
            "transaction-history-table__data transaction-history-table__data--amount",
          align: "right",
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
        Cell: ({ cell }: { cell: MRT_Cell<PermitHistoryWithRefund> }) => (
          <CustomFormComponent
            type="number"
            feature="refund-permit"
            options={{
              name: `refundData.${cell.row.index}.refundAmount`,
              rules: { required: false },
            }}
          />
        ),
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
        Cell: ({ cell }: { cell: MRT_Cell<PermitHistoryWithRefund> }) => (
          <CustomFormComponent
            type="input"
            feature="refund-permit"
            options={{
              name: `refundData.${cell.row.index}.refundTransactionId`,
              rules: { required: false },
            }}
          />
        ),
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
        Cell: ({ cell }: { cell: MRT_Cell<PermitHistoryWithRefund> }) => (
          <FormControlLabel
            control={
              <Checkbox
                className={`cheque-refund-checkbox ${
                  // You can add any condition here if you need to disable it
                  false // Replace with your actual condition if needed
                }`}
                checked={cell.getValue() as boolean} // Access the checkbox state from the cell value
                onChange={() => {
                  // Use react-hook-form to set the checkbox value
                  const newValue = !cell.getValue(); // Toggle the value
                  formMethods.setValue(
                    `refundData.${cell.row.index}.chequeRefund`,
                    newValue,
                  );
                }}
              />
            }
            label="Cheque Refund" // You can replace this with the actual label you want
            classes={{
              root: "cheque-refund-label",
              disabled: "cheque-refund-label--disabled",
            }}
          />
        ),
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    ...defaultTableOptions,
    columns: columns,
    data: validTransactionHistory,
    enableRowActions: false,
    enableGlobalFilter: false,
    enableTopToolbar: false,
    enableBottomToolbar: false,
    // enableRowSelection: (row: MRT_Row<PermitHistory>) =>
    //   isTransactionTypeRefund(row.original.transactionTypeId) ||
    //   !isZeroAmount(row.original.transactionAmount),
    initialState: {
      ...defaultTableInitialStateOptions,
      showGlobalFilter: false,
    },
    state: {
      ...defaultTableStateOptions,
    },
    muiTablePaperProps: {
      className: "transaction-history-table",
    },
    muiTableContainerProps: {
      className: "transaction-history-table__table",
    },
  });

  return (
    <FormProvider {...formMethods}>
      <MaterialReactTable table={table} />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit(onSubmit)}
        className="submit-btn"
      >
        Finish
      </Button>
    </FormProvider>
  );
};
