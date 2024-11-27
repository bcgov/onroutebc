/* eslint-disable @typescript-eslint/no-unused-vars */
import { FormProvider, useForm, FieldValues } from "react-hook-form";
import { Button, Typography } from "@mui/material";
import "./RefundPage.scss";
import { MultiplePaymentMethodRefundData } from "./types/RefundFormData";
import { PermitHistory } from "../../types/PermitHistory";
import { TransactionHistoryTable } from "./components/TransactionHistoryTable";
import { calculateNetAmount } from "../../helpers/feeSummary";
import { isValidTransaction } from "../../helpers/payment";
import { Nullable } from "../../../../common/types/common";
import { RefundDetails } from "./components/RefundDetails";
import { useState } from "react";
import { RefundErrorModal } from "./components/RefundErrorModal";

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
  fax,
  reason,
  permitNumber,
  permitAction,
  amountToRefund,
  onSubmit,
}: {
  permitHistory: PermitHistory[];
  email?: Nullable<string>;
  additionalEmail?: Nullable<string>;
  fax?: Nullable<string>;
  reason?: Nullable<string>;
  permitNumber?: Nullable<string>;
  permitAction: PermitAction;
  amountToRefund: number;
  onSubmit: (data: FieldValues) => void;
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

  const formMethods = useForm<MultiplePaymentMethodRefundData[]>({
    defaultValues: validTransactionHistory.map((transaction) => ({
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
    reValidateMode: "onChange",
  });

  const { handleSubmit } = formMethods;

  const handleAmend = (data: FieldValues) => {
    // TODO ask praveen if this data is the correct shape expected by the BE
    const combinedData: MultiplePaymentMethodRefundData[] =
      validTransactionHistory.map((originalRow, index) => ({
        ...originalRow, // Spread the properties of PermitHistory
        refundAmount: data.refundData[index]?.refundAmount || "", // Get the refundAmount from the submitted data
        refundTransactionId: data.refundData[index]?.refundTransactionId || "", // Get the refundTransactionId from the submitted data
        chequeRefund: data.refundData[index]?.chequeRefund || false, // Get the chequeRefund from the submitted data
      }));
    // Call the onSubmit with the combined data
    onSubmit(combinedData);
  };

  return (
    <div className="refund-page">
      <Typography variant="h2" className="refund-info__header">
        Ameding Permit #: {permitNumber}
      </Typography>
      <RefundDetails
        totalRefundDue={amountToRefund}
        currentPermitValue={currentPermitValue}
        newPermitValue={newPermitValue}
      />
      <Typography variant="h2" className="refund-info__header">
        Transaction History
      </Typography>
      <FormProvider {...formMethods}>
        <TransactionHistoryTable
          permitHistory={validTransactionHistory}
          totalRefundDue={amountToRefund}
        />

        {permitAction === PERMIT_REFUND_ACTIONS.AMEND && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit(handleAmend)}
            className="refund-page__submit-btn"
          >
            Finish
          </Button>
        )}
      </FormProvider>

      {(permitAction === PERMIT_REFUND_ACTIONS.VOID ||
        permitAction === PERMIT_REFUND_ACTIONS.REVOKE) && (
        <div>
          <div className="refund-info refund-info--send">
            <div className="refund-info__header">
              Send Permit and Receipt to
            </div>
            {email && (
              <div className="refund-info__info">
                <span className="info-label">Company Email: </span>
                <span className="info-value" data-testid="send-to-email">
                  {email}
                </span>
              </div>
            )}
            {additionalEmail && (
              <div className="refund-info__info">
                <span className="info-label">Additional Email: </span>
                <span
                  className="info-value"
                  data-testid="send-to-additional-email"
                >
                  {additionalEmail}
                </span>
              </div>
            )}
            {fax && (
              <div className="refund-info__info">
                <span className="info-label">Fax: </span>
                <span className="info-value" data-testid="send-to-fax">
                  {fax}
                </span>
              </div>
            )}
          </div>
          {reason && (
            <div className="refund-info refund-info--reason">
              <div className="refund-info__header">
                Reason for {permitActionText(permitAction)}
              </div>
              <div className="refund-info__info">{reason}</div>
            </div>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit(onSubmit)}
            className="refund-page__submit-btn"
          >
            Finish
          </Button>
        </div>
      )}

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
