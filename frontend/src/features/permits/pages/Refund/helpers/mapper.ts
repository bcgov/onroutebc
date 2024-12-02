import { PAYMENT_METHOD_TYPE_CODE } from "../../../../../common/types/paymentMethods";
import { RefundFormData } from "../types/RefundFormData";

export const mapToRefundRequestData = (refundData: RefundFormData) => {
  const getRefundMethodType = () => {
    return refundData.chequeRefund
      ? PAYMENT_METHOD_TYPE_CODE.CHEQUE
      : refundData.paymentMethodTypeCode;
  };

  return {
    pgTransactionId: refundData.pgTransactionId,
    pgPaymentMethod: refundData.pgPaymentMethod,
    transactionAmount: refundData.refundAmount,
    paymentCardTypeCode: refundData.paymentCardTypeCode,
    paymentMethodTypeCode: getRefundMethodType(),
  };
};
