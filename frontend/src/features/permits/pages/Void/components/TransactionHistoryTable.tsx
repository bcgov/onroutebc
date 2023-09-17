import { useMemo } from "react";
import { applyWhenNotNullable, getDefaultRequiredVal } from "../../../../../common/helpers/util";
import { feeSummaryDisplayText, isTransactionTypeRefund } from "../../../helpers/feeSummary";
import { PermitHistory } from "../../../types/PermitHistory";
import "./TransactionHistoryTable.scss";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";

export const TransactionHistoryTable = ({
  permitHistory,
}: {
  permitHistory: PermitHistory[];
}) => {
  const columns = useMemo<MRT_ColumnDef<PermitHistory>[]>(() => [
    {
      accessorKey: "permitNumber",
      header: "Permit #",
      muiTableHeadCellProps: {
        className: "transaction-history-table__header transaction-history-table__header--permit",
      },
      muiTableBodyCellProps: {
        className: "transaction-history-table__data transaction-history-table__data--permit",
      },
      size: 150,
      enableSorting: false,
      enableColumnActions: false,
    },
    {
      accessorFn: (originalRow) => 
        getPaymentMethodText(originalRow.paymentMethod),
      id: "paymentMethod",
      header: "Payment Method",
      muiTableHeadCellProps: {
        className: "transaction-history-table__header transaction-history-table__header--payment",
      },
      muiTableBodyCellProps: {
        className: "transaction-history-table__data transaction-history-table__data--payment",
      },
      size: 200,
      enableSorting: false,
      enableColumnActions: false,
    },
    {
      accessorFn: (originalRow) => 
        getDefaultRequiredVal("NA", `${originalRow.providerTransactionId}`),
      id: "providerTransactionId",
      header: "Transaction ID",
      muiTableHeadCellProps: {
        className: "transaction-history-table__header transaction-history-table__header--transaction",
      },
      muiTableBodyCellProps: {
        className: "transaction-history-table__data transaction-history-table__data--transaction",
      },
      size: 100,
      enableSorting: false,
      enableColumnActions: false,
    },
    {
      accessorFn: (originalRow) => {
        const amount = isTransactionTypeRefund(originalRow.transactionType) 
          ? -1 * originalRow.transactionAmount : originalRow.transactionAmount;
        
        return feeSummaryDisplayText(
          applyWhenNotNullable((val) => `${val}`, amount)
        );
      },
      header: "Amount (CAD)",
      muiTableHeadCellProps: {
        className: "transaction-history-table__header transaction-history-table__header--amount",
        align: "right",
      },
      muiTableBodyCellProps: {
        className: "transaction-history-table__data transaction-history-table__data--amount",
        align: "right",
      },
      id: "transactionAmount",
      size: 50,
      enableSorting: false,
      enableColumnActions: false,
    },
  ], []);

  const availablePaymentMethods = [
    {
      value: "CC",
      label: "Icepay - Mastercard (Debit)",
    },
  ]; // hardcoded

  const getPaymentMethodText = (payMethod?: string) => {
    return getDefaultRequiredVal(
      "NA",
      availablePaymentMethods.find(method => method.value === payMethod)?.label
    );
  };

  return (
    <MaterialReactTable
      columns={columns}
      data={permitHistory}
      enablePagination={false}
      enableTopToolbar={false}
      enableBottomToolbar={false}
      enableRowActions={false}
      enableColumnActions={false}
      muiTableProps={{
        className: "transaction-history-table",
      }}
    />
  );
};
