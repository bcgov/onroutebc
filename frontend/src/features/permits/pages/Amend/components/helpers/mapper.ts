import { getDefaultRequiredVal } from "../../../../../../common/helpers/util";
import { TRANSACTION_TYPES } from "../../../../types/payment.d";
import { RefundFormData } from "../../../Refund/types/RefundFormData";
import { 
  CONSOLIDATED_PAYMENT_METHODS, 
  PAYMENT_METHOD_TYPE_CODE, 
} from "../../../../../../common/types/paymentMethods";

export const mapToAmendRequestData = (
  refundData: RefundFormData,
  amountToRefund: number,
  permitId: string,
) => {
  const isZeroAmount = Math.abs(amountToRefund) < 0.000001;

  const getRefundMethodType = () => {
    if (isZeroAmount) return PAYMENT_METHOD_TYPE_CODE.WEB;

    const refundMethodTypeCode = getDefaultRequiredVal(
      PAYMENT_METHOD_TYPE_CODE.WEB,
      CONSOLIDATED_PAYMENT_METHODS[refundData.refundMethod]?.paymentMethodTypeCode
    );

    return refundData.shouldUsePrevPaymentMethod ?
      refundMethodTypeCode :
      PAYMENT_METHOD_TYPE_CODE.CHEQUE;
  };

  const getRefundCardType = () => {
    if (isZeroAmount || !refundData.shouldUsePrevPaymentMethod) {
      return undefined;
    }

    return CONSOLIDATED_PAYMENT_METHODS[refundData.refundMethod]?.paymentCardTypeCode;
  };

  const reqData = {
    transactionTypeId: isZeroAmount ? TRANSACTION_TYPES.Z : TRANSACTION_TYPES.R,
    paymentMethodTypeCode: getRefundMethodType(),
    applicationDetails: [
      {
        applicationId: permitId,
        transactionAmount: amountToRefund,
      },
    ],
  };

  if (isZeroAmount) {
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
