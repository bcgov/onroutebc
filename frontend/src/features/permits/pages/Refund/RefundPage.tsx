import { FormProvider, useForm } from "react-hook-form";
import { Button, Typography } from "@mui/material";
import "./RefundPage.scss";
import { RefundFormData } from "./types/RefundFormData";
import { PermitHistory } from "../../types/PermitHistory";
import { TransactionHistoryTable } from "./components/TransactionHistoryTable";
import { calculateNetAmount } from "../../helpers/feeSummary";
import { isValidTransaction } from "../../helpers/payment";
import { Nullable } from "../../../../common/types/common";
import { RefundDetails } from "./components/RefundDetails";
import { useState } from "react";
import { RefundErrorModal } from "./components/RefundErrorModal";
import { MRT_RowSelectionState } from "material-react-table";

export const PERMIT_REFUND_ACTIONS = {
  VOID: "void",
  REVOKE: "revoke",
  AMEND: "amend",
} as const;

export type PermitAction =
  (typeof PERMIT_REFUND_ACTIONS)[keyof typeof PERMIT_REFUND_ACTIONS];

const permitActionText = (permitAction: PermitAction) => {
  switch (permitAction) {
    case PERMIT_REFUND_ACTIONS.VOID:
      return "Voiding";
    case PERMIT_REFUND_ACTIONS.REVOKE:
      return "Revoking";
    case PERMIT_REFUND_ACTIONS.AMEND:
    default:
      return "Amending";
  }
};

export const RefundPage = ({
  permitHistory,
  email,
  additionalEmail,
  reason,
  permitNumber,
  permitAction,
  amountToRefund,
  handleFinish,
  disableSubmitButton,
}: {
  permitHistory: PermitHistory[];
  email?: Nullable<string>;
  additionalEmail?: Nullable<string>;
  reason?: Nullable<string>;
  permitNumber?: Nullable<string>;
  permitAction: PermitAction;
  amountToRefund: number;
  handleFinish: (refundData: RefundFormData[]) => void;
  disableSubmitButton: boolean;
}) => {
  const currentPermitValue = calculateNetAmount(permitHistory);
  const newPermitValue = currentPermitValue - Math.abs(amountToRefund);

  const validTransactionHistory = permitHistory.filter((history) =>
    isValidTransaction(history.paymentMethodTypeCode, history.pgApproved),
  );

  const [showRefundErrorModal, setShowRefundErrorModal] =
    useState<boolean>(false);

  const handleCloseRefundErrorModal = () => {
    setShowRefundErrorModal(false);
  };

  const formMethods = useForm<{
    refundData: RefundFormData[];
  }>({
    defaultValues: {
      refundData: validTransactionHistory.map((transaction) => ({
        permitNumber: transaction.permitNumber,
        pgPaymentMethod: transaction.pgPaymentMethod,
        pgTransactionId: transaction.pgTransactionId,
        transactionOrderNumber: transaction.transactionOrderNumber,
        transactionTypeId: transaction.transactionTypeId,
        paymentCardTypeCode: transaction.paymentCardTypeCode,
        paymentMethodTypeCode: transaction.paymentMethodTypeCode,
        transactionAmount: transaction.transactionAmount,
        refundAmount: "",
        refundTransactionId: "",
        chequeRefund: false,
      })),
    },
    reValidateMode: "onChange",
  });

  const { handleSubmit } = formMethods;

  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

  const onSubmit = (data: { refundData: RefundFormData[] }) => {
    if (amountToRefund <= 0) {
      handleFinish(data.refundData);
    } else {
      // Get the selected row IDs based on permitNumber from rowSelection
      const selectedRowIds = Object.keys(rowSelection).filter(
        (id) => rowSelection[id],
      );

      // Filter table data to include only selected rows based on permitNumber
      const selectedTransactions = data.refundData.filter(
        (transaction: RefundFormData) =>
          selectedRowIds.includes(transaction.permitNumber),
      );

      // Call the onSubmit with the selected transactions
      handleFinish(selectedTransactions);
    }
  };

  return (
    <div className="refund-page">
      <h2 className="refund-page__header refund-page__header--main">
        {permitActionText(permitAction)} Permit #: {permitNumber}
      </h2>
      <RefundDetails
        totalRefundDue={amountToRefund}
        currentPermitValue={currentPermitValue}
        newPermitValue={newPermitValue}
      />
      <h2 className="refund-page__header">Transaction History</h2>
      <FormProvider {...formMethods}>
        <TransactionHistoryTable
          permitHistory={validTransactionHistory}
          totalRefundDue={amountToRefund}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
        />
        {(permitAction === PERMIT_REFUND_ACTIONS.VOID ||
          permitAction === PERMIT_REFUND_ACTIONS.REVOKE) && (
          <div>
            <div className="refund-page__section">
              <h2 className="refund-page__header">
                Send Permit and Receipt to
              </h2>
              {email && (
                <div className="refund-page__info">
                  <span className="info__label">Company Email: </span>
                  <span className="info__value" data-testid="send-to-email">
                    {email}
                  </span>
                </div>
              )}
              {additionalEmail && (
                <div className="refund-page__info">
                  <span className="info__label">Additional Email: </span>
                  <span
                    className="info__value"
                    data-testid="send-to-additional-email"
                  >
                    {additionalEmail}
                  </span>
                </div>
              )}
            </div>

            {reason && (
              <div className="refund-page__section">
                <h2 className="refund-page__header">
                  Reason for {permitActionText(permitAction)}
                </h2>
                <div className="refund-page__info">
                  <div className="info__value">{reason}</div>
                </div>
              </div>
            )}
          </div>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit(onSubmit)}
          disabled={disableSubmitButton}
          className="refund-page__button"
        >
          Finish
        </Button>
      </FormProvider>

      {showRefundErrorModal && (
        <RefundErrorModal
          isOpen={showRefundErrorModal}
          onCancel={handleCloseRefundErrorModal}
          onConfirm={handleCloseRefundErrorModal}
        />
      )}
    </div>
  );
};
