import { useMemo } from "react";

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
import {
  getPaymentMethod,
  PAYMENT_METHOD_TYPE_CODE,
} from "../../../../../common/types/paymentMethods";
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
import { RefundFormData } from "../types/RefundFormData";
import { RefundAmountInput } from "./RefundAmountInput";
import { RefundTransactionIdInput } from "./RefundTransactionIdInput";
import { ChequeRefundCheckbox } from "./ChequeRefundCheckbox";
import { StatusChip } from "../../../../settings/components/creditAccount/StatusChip";
import {
  CREDIT_ACCOUNT_STATUS_TYPE,
  CreditAccountStatusType,
  EGARMS_SUCCESS_CODE,
} from "../../../../settings/types/creditAccount";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "@mui/material";
import { getEGARMSErrorMessage } from "../../../../settings/helpers/creditAccount";

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

  const isRowSelectable = (row: MRT_Row<RefundFormData>): boolean => {
    return (
      !isTransactionTypeRefund(row.original.transactionTypeId) &&
      !isZeroAmount(row.original.transactionAmount) &&
      totalRefundDue !== 0
    );
  };

  const isCreditAccount = (row: MRT_Row<RefundFormData>): boolean => {
    return (
      row.original.paymentMethodTypeCode === PAYMENT_METHOD_TYPE_CODE.ACCOUNT
    );
  };

  const isCreditAccountClosed = (row: MRT_Row<RefundFormData>): boolean => {
    return (
      isCreditAccount(row) &&
      row.original.creditAccountStatusType === CREDIT_ACCOUNT_STATUS_TYPE.CLOSED
    );
  };

  const isCreditAccountEgarmsError = (
    row: MRT_Row<RefundFormData>,
  ): boolean => {
    return (
      isCreditAccount(row) &&
      row.original.egarmsReturnCode !== EGARMS_SUCCESS_CODE.I0001
    );
  };

  const columns = useMemo<MRT_ColumnDef<RefundFormData>[]>(
    () => [
      {
        accessorKey: "permitNumber",
        header: "Permit #",
        size: 160,
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
        size: 200,
        enableSorting: false,
        enableColumnActions: false,
        Cell: ({
          row,
          cell,
        }: {
          row: MRT_Row<RefundFormData>;
          cell: MRT_Cell<RefundFormData>;
        }) => (
          <div className="cell__inner ">
            <div className="cell__value">              
              {cell.getValue<string>()}
              {row?.original?.creditAccountStatusType && (
                <StatusChip
                  status={
                    row?.original
                      ?.creditAccountStatusType as CreditAccountStatusType
                  }
                />
              )}
              {isCreditAccountEgarmsError(row) && (
                <div className="transaction-history-table__egarms-error">
                  <span>
                    eGARMS return code {row.original.egarmsReturnCode}
                    <Tooltip title={getEGARMSErrorMessage(row.original.egarmsReturnCode)}>
                      <FontAwesomeIcon
                        icon={faQuestionCircle}
                        className="button__icon"
                      />
                    </Tooltip>
                  </span>
                </div>
              )}
            </div>
          </div>
        ),
      },
      {
        accessorFn: (originalRow) =>
          getDefaultRequiredVal("", originalRow.pgTransactionId),
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
        id: "refundAmount",
        header: "Refund Amount (CAD)",
        size: 100,
        enableSorting: false,
        enableColumnActions: false,
        Cell: ({ cell }: { cell: MRT_Cell<RefundFormData> }) => {
          return (
            isRowSelectable(cell.row) && (
              <div className="cell__inner">
                <RefundAmountInput cell={cell} />
              </div>
            )
          );
        },
      },
      {
        id: "refundTransactionId",
        header: "Refund Tran ID",
        size: 100,
        enableSorting: false,
        enableColumnActions: false,
        Cell: ({ cell }: { cell: MRT_Cell<RefundFormData> }) => {
          return (
            isRowSelectable(cell.row) && (
              <div className="cell__inner">
                <RefundTransactionIdInput cell={cell} />
              </div>
            )
          );
        },
      },
      {
        id: "chequeRefund",
        header: "",
        size: 100,
        enableSorting: false,
        enableColumnActions: false,
        Cell: ({ cell }: { cell: MRT_Cell<RefundFormData> }) => {
          return (
            isRowSelectable(cell.row) &&
            !isCreditAccount(cell.row) && (
              <div className="cell__inner">
                <ChequeRefundCheckbox cell={cell} />
              </div>
            )
          );
        },
      },
    ],
    [totalRefundDue],
  );

  const table = useMaterialReactTable({
    ...defaultTableOptions,
    columns: columns,
    data: validTransactionHistory,
    onRowSelectionChange: setRowSelection,
    state: {
      ...defaultTableStateOptions,
      rowSelection,
      columnVisibility: { chequeRefund: totalRefundDue !== 0 },
    },
    initialState: {
      ...defaultTableInitialStateOptions,
      showGlobalFilter: false,
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
      className: `transaction-history-table__checkbox ${isCreditAccountClosed(row) && "transaction-history-table__checkbox--inactive"} ${!isRowSelectable(row) && "transaction-history-table__checkbox--disabled"}`,
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
    muiTableBodyCellProps: ({ row }: { row: MRT_Row<RefundFormData> }) => ({
      className: `transaction-history-table__cell transaction-history-table__cell--body ${isCreditAccountEgarmsError(row) && "transaction-history-table__cell--egarms-error"}`,
    }),
  });

  return (
    <>
      <MaterialReactTable table={table} />
    </>
  );
};
