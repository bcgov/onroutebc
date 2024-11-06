/* eslint-disable @typescript-eslint/no-unused-vars */
import { FormProvider, useForm, FieldValues } from "react-hook-form";
import { Typography } from "@mui/material";
import "./RefundPage.scss";
import {
  MultiplePaymentMethodRefundData,
  RefundFormData,
} from "./types/RefundFormData";
import { PermitHistory } from "../../types/PermitHistory";
import { TransactionHistoryTable } from "./components/TransactionHistoryTable";
import { calculateNetAmount } from "../../helpers/feeSummary";
import { isValidTransaction } from "../../helpers/payment";
import { Nullable } from "../../../../common/types/common";
import { RefundDetails } from "./components/RefundDetails";
import {
  getPaymentMethod,
  PAYMENT_METHOD_TYPE_CODE,
  PAYMENT_METHODS_WITH_CARD,
} from "../../../../common/types/paymentMethods";
import { useRefundPermitMutation } from "./hooks/hooks";

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
  onFinish,
}: {
  permitHistory: PermitHistory[];
  email?: Nullable<string>;
  additionalEmail?: Nullable<string>;
  fax?: Nullable<string>;
  reason?: Nullable<string>;
  permitNumber?: Nullable<string>;
  permitAction: PermitAction;
  amountToRefund: number;
  onFinish: (refundData: RefundFormData) => void;
}) => {
  const currentPermitValue = calculateNetAmount(permitHistory);
  const newPermitValue = currentPermitValue - Math.abs(amountToRefund);

  const validTransactionHistory = permitHistory.filter((history) =>
    isValidTransaction(history.paymentMethodTypeCode, history.pgApproved),
  );

  const formMethods = useForm<MultiplePaymentMethodRefundData[]>({
    defaultValues: validTransactionHistory.map((transaction) => ({
      permitNumber: transaction.permitNumber, // Use values from the validTransactionHistory
      comment: transaction.comment,
      commentUsername: transaction.commentUsername,
      transactionAmount: transaction.transactionAmount,
      transactionOrderNumber: transaction.transactionOrderNumber,
      pgTransactionId: transaction.pgTransactionId,
      pgPaymentMethod: transaction.pgPaymentMethod,
      paymentCardTypeCode: transaction.paymentCardTypeCode,
      paymentMethodTypeCode: transaction.paymentMethodTypeCode,
      transactionTypeId: transaction.transactionTypeId,
      permitId: transaction.permitId,
      transactionSubmitDate: transaction.transactionSubmitDate,
      pgApproved: transaction.pgApproved,
      refundAmount: "", // Default value for the refund field
      refundTransactionId: "", // Default value for the refund field
      chequeRefund: false, // Default value for the refund field
    })),
    reValidateMode: "onChange",
  });

  const { mutateAsync: refundPermit } = useRefundPermitMutation();

  const onSubmit = (data: FieldValues) => {
    console.log({
      applicationId: data[0].permitId,
      transactions: data.map(
        (transaction: MultiplePaymentMethodRefundData) => ({
          paymentMethodTypeCode: transaction.chequeRefund
            ? PAYMENT_METHOD_TYPE_CODE.CHEQUE
            : transaction.paymentMethodTypeCode,
          paymentCardTypeCode: transaction.paymentCardTypeCode,
          pgCardType: transaction.paymentCardTypeCode,
          pgTransactionId: transaction.refundTransactionId,
          pgPaymentMethod: transaction.pgPaymentMethod,
          transactionAmount: Number(transaction.refundAmount),
        }),
      ),
    });
    // refundPermit({
    //   applicationId: data[0].permitId,
    //   transactions: data.map(
    //     (transaction: MultiplePaymentMethodRefundData) => ({
    //       paymentMethodTypeCode: transaction.chequeRefund
    //         ? PAYMENT_METHOD_TYPE_CODE.CHEQUE
    //         : transaction.paymentMethodTypeCode,
    //       paymentCardTypeCode: transaction.paymentCardTypeCode,
    //       pgCardType: transaction.paymentCardTypeCode,
    //       pgTransactionId: transaction.pgTransactionId,
    //       pgPaymentMethod: transaction.pgPaymentMethod,
    //       transactionAmount: transaction.refundAmount,
    //     }),
    //   ),
    // });
  };

  const showSendSection = permitAction === "void" || permitAction === "revoke";
  const showReasonSection =
    (permitAction === "void" || permitAction === "revoke") && reason;

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
          onSubmit={onSubmit}
        />
      </FormProvider>

      {showSendSection ? (
        <div className="refund-info refund-info--send">
          <div className="refund-info__header">Send Permit and Receipt to</div>
          {email ? (
            <div className="refund-info__info">
              <span className="info-label">Company Email: </span>
              <span className="info-value" data-testid="send-to-email">
                {email}
              </span>
            </div>
          ) : null}
          {additionalEmail ? (
            <div className="refund-info__info">
              <span className="info-label">Additional Email: </span>
              <span
                className="info-value"
                data-testid="send-to-additional-email"
              >
                {additionalEmail}
              </span>
            </div>
          ) : null}
          {fax ? (
            <div className="refund-info__info">
              <span className="info-label">Fax: </span>
              <span className="info-value" data-testid="send-to-fax">
                {fax}
              </span>
            </div>
          ) : null}
        </div>
      ) : null}
      {showReasonSection ? (
        <div className="refund-info refund-info--reason">
          <div className="refund-info__header">
            Reason for {permitActionText(permitAction)}
          </div>
          <div className="refund-info__info">{reason}</div>
        </div>
      ) : null}
    </div>
  );
};
