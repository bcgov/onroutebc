import { PAYMENT_METHOD_TYPE_CODE } from "../../../../../../common/types/paymentMethods";
import { TRANSACTION_TYPES } from "../../../../types/payment.d";
import { RefundFormData } from "../../../Refund/types/RefundFormData";

export const mapToAmendRequestData = (
  refundData: RefundFormData,
  amountToRefund: number,
  permitId: string,
) => {
  const isZeroAmount = Math.abs(amountToRefund) < 0.000001;
  const reqData = {
    transactionTypeId: isZeroAmount ? TRANSACTION_TYPES.Z : TRANSACTION_TYPES.R,
    paymentMethodTypeCode: PAYMENT_METHOD_TYPE_CODE.Web, // hardcoded to "WEB" - Web
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
    pgTransactionId: refundData.transactionId,
    pgCardType: refundData.refundCardType
      ? refundData.refundCardType
      : undefined,
    pgPaymentMethod: refundData.refundOnlineMethod
      ? refundData.refundOnlineMethod
      : undefined,
    ...reqData,
  };
};
