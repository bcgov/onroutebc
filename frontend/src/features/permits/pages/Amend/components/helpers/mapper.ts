import { getDefaultRequiredVal } from "../../../../../../common/helpers/util";
import { TRANSACTION_TYPES } from "../../../../types/payment.d";
import { RefundFormData } from "../../../Refund/types/RefundFormData";
import { isZeroAmount } from "../../../../helpers/feeSummary";
import {
  CONSOLIDATED_PAYMENT_METHODS,
  PAYMENT_METHOD_TYPE_CODE,
} from "../../../../../../common/types/paymentMethods";

export const mapToAmendRequestData = (
  refundData: RefundFormData,
  amountToRefund: number,
  permitId: string,
) => {
  const isRefundZeroAmount = isZeroAmount(amountToRefund);

  const getRefundMethodType = () => {
    if (isRefundZeroAmount) return PAYMENT_METHOD_TYPE_CODE.NP;

    const refundMethodTypeCode = getDefaultRequiredVal(
      PAYMENT_METHOD_TYPE_CODE.WEB,
      CONSOLIDATED_PAYMENT_METHODS[refundData.refundMethod]
        ?.paymentMethodTypeCode,
    );

    return refundData.shouldUsePrevPaymentMethod
      ? refundMethodTypeCode
      : PAYMENT_METHOD_TYPE_CODE.CHEQUE;
  };

  const getRefundCardType = () => {
    if (isRefundZeroAmount || !refundData.shouldUsePrevPaymentMethod) {
      return undefined;
    }

    return CONSOLIDATED_PAYMENT_METHODS[refundData.refundMethod]
      ?.paymentCardTypeCode;
  };

  const reqData = {
    // Zero-dolloar amounts are considered "Purchases", as documented
    transactionTypeId: isRefundZeroAmount ? TRANSACTION_TYPES.P : TRANSACTION_TYPES.R,
    paymentMethodTypeCode: getRefundMethodType(),
    applicationDetails: [
      {
        applicationId: permitId,
        transactionAmount: amountToRefund,
      },
    ],
  };

  if (isRefundZeroAmount) {
    return reqData;
  }

  return {
    ...reqData,
    pgTransactionId: refundData.transactionId,
    pgCardType: getRefundCardType(),
    paymentCardTypeCode: getRefundCardType(),
    pgPaymentMethod: refundData.refundOnlineMethod
      ? refundData.refundOnlineMethod
      : undefined,
  };
};
