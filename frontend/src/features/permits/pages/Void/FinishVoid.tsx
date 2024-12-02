/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { VoidPermitContext } from "./context/VoidPermitContext";
import { Permit } from "../../types/permit";
import { usePermitHistoryQuery } from "../../hooks/hooks";
import { calculateAmountForVoid, isZeroAmount } from "../../helpers/feeSummary";
import { PERMIT_REFUND_ACTIONS, RefundPage } from "../Refund/RefundPage";
import { mapToVoidRequestData } from "./helpers/mapper";
import { useVoidPermit } from "./hooks/useVoidPermit";
import { isValidTransaction } from "../../helpers/payment";
import { Nullable } from "../../../../common/types/common";
import { hasPermitsActionFailed } from "../../helpers/permitState";
import {
  applyWhenNotNullable,
  getDefaultRequiredVal,
} from "../../../../common/helpers/util";
import { FieldValues } from "react-hook-form";
import { MultiplePaymentMethodRefundData } from "../Refund/types/RefundFormData";
import { RefundErrorModal } from "../Refund/components/RefundErrorModal";
import { PERMIT_STATUSES } from "../../types/PermitStatus";
import { PAYMENT_METHOD_TYPE_CODE } from "../../../../common/types/paymentMethods";
import { TRANSACTION_TYPES } from "../../types/payment";

export const FinishVoid = ({
  permit,
  onSuccess,
  onFail,
}: {
  permit: Nullable<Permit>;
  onSuccess: () => void;
  onFail: () => void;
}) => {
  const { voidPermitData } = useContext(VoidPermitContext);
  const { companyId: companyIdParam } = useParams();

  const { email, additionalEmail, fax, reason } = voidPermitData;
  const companyId: number = getDefaultRequiredVal(
    0,
    permit?.companyId,
    applyWhenNotNullable((id) => Number(id), companyIdParam),
  );

  const originalPermitId = getDefaultRequiredVal("", permit?.originalPermitId);

  const permitHistoryQuery = usePermitHistoryQuery(companyId, originalPermitId);

  const permitHistory = getDefaultRequiredVal([], permitHistoryQuery.data);

  const transactionHistory = permitHistoryQuery.isLoading
    ? []
    : permitHistory.filter((history) =>
        isValidTransaction(history.paymentMethodTypeCode, history.pgApproved),
      );

  const amountToRefund =
    !permit || transactionHistory.length === 0
      ? 0
      : -1 * calculateAmountForVoid(permit, transactionHistory);

  const { mutation: voidPermitMutation, voidResults } = useVoidPermit();

  useEffect(() => {
    const voidFailed = hasPermitsActionFailed(voidResults);
    if (voidFailed) {
      onFail();
    } else if (getDefaultRequiredVal(0, voidResults?.success?.length) > 0) {
      // Void action was triggered, and has results (was successful)
      onSuccess();
    }
  }, [voidResults]);

  const [showRefundErrorModal, setShowRefundErrorModal] =
    useState<boolean>(false);

  const handleCloseRefundErrorModal = () => {
    setShowRefundErrorModal(false);
  };

  const isRefundZeroAmount = isZeroAmount(amountToRefund);

  const onSubmit = (data: FieldValues) => {
    const totalRefundAmount = data.reduce(
      (sum: number, transaction: MultiplePaymentMethodRefundData) =>
        sum + Number(transaction.refundAmount),
      0,
    );

    if (totalRefundAmount !== Math.abs(amountToRefund)) {
      setShowRefundErrorModal(true);
      return;
    }

    console.log(data);

    console.log({
      permitId: originalPermitId,
      voidData: {
        status: PERMIT_STATUSES.VOIDED,
        transactions: data.map(
          (transaction: MultiplePaymentMethodRefundData) => ({
            pgTransactionId: transaction.pgTransactionId,
            pgPaymentMethod: transaction.pgPaymentMethod,
            paymentCardTypeCode: transaction.paymentCardTypeCode,
            transactionAmount: Number(transaction.refundAmount),
            paymentMethodTypeCode:
              Number(transaction.refundAmount) === 0
                ? PAYMENT_METHOD_TYPE_CODE.NP
                : transaction.chequeRefund
                  ? PAYMENT_METHOD_TYPE_CODE.CHEQUE
                  : transaction.paymentMethodTypeCode,
          }),
        ),
        transactionTypeId: isRefundZeroAmount
          ? TRANSACTION_TYPES.P
          : TRANSACTION_TYPES.R,
        comment: voidPermitData.reason,
        fax: voidPermitData.fax,
        additionalEmail: voidPermitData.additionalEmail,
      },
    });

    // voidPermitMutation.mutate({
    //   permitId: originalPermitId,
    //   voidData: {
    //     status: PERMIT_STATUSES.VOIDED,
    //     transactions: data.map(
    //       (transaction: MultiplePaymentMethodRefundData) => ({
    //         pgTransactionId: transaction.pgTransactionId,
    //         pgPaymentMethod: transaction.pgPaymentMethod,
    //         paymentCardTypeCode: transaction.paymentCardTypeCode,
    //         transactionAmount: Number(transaction.refundAmount),
    //         paymentMethodTypeCode:
    //           Number(transaction.refundAmount) === 0
    //             ? PAYMENT_METHOD_TYPE_CODE.NP
    //             : transaction.chequeRefund
    //               ? PAYMENT_METHOD_TYPE_CODE.CHEQUE
    //               : transaction.paymentMethodTypeCode,
    //       }),
    //     ),
    //     transactionTypeId: isRefundZeroAmount
    //       ? TRANSACTION_TYPES.P
    //       : TRANSACTION_TYPES.R,
    //     comment: data.comment,
    //     fax: data.fax,
    //     additionalEmail: data.additionalEmail,
    //   },
    // });

    // const requestData = mapToVoidRequestData(
    //   voidPermitData,
    //   data,
    //   -1 * amountToRefund,
    // );
    // voidPermitMutation.mutate({
    //   permitId: voidPermitData.permitId,
    //   voidData: requestData,
    // });
  };

  return (
    <>
      <RefundPage
        permitHistory={transactionHistory}
        amountToRefund={amountToRefund}
        email={email}
        additionalEmail={additionalEmail}
        fax={fax}
        reason={reason}
        permitNumber={permit?.permitNumber}
        permitAction={PERMIT_REFUND_ACTIONS.VOID}
        onSubmit={onSubmit}
      />
      {showRefundErrorModal && (
        <RefundErrorModal
          isOpen={showRefundErrorModal}
          onCancel={handleCloseRefundErrorModal}
          onConfirm={handleCloseRefundErrorModal}
        />
      )}
    </>
  );
};
