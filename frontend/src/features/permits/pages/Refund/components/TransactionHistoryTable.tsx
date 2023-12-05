import { useMemo } from "react";

import {
  MRT_ColumnDef,
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
} from "../../../helpers/feeSummary";

import {
  defaultTableInitialStateOptions,
  defaultTableOptions,
  defaultTableStateOptions,
} from "../../../../../common/constants/defaultTableOptions";

export const TransactionHistoryTable = ({
  permitHistory,
}: {
  permitHistory: PermitHistory[];
}) => {
  const validTransactionHistory = permitHistory.filter(history =>
    isValidTransaction(history.paymentMethodTypeCode, history.pgApproved));

  const columns = useMemo<MRT_ColumnDef<PermitHistory>[]>(
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
        header: "Transaction ID",
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
    enableRowSelection: false,
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

  return <MaterialReactTable table={table} />;
};
