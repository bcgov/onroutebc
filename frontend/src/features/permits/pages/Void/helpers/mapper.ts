import { getDefaultRequiredVal } from "../../../../../common/helpers/util";
import { CONSOLIDATED_PAYMENT_METHODS, PAYMENT_METHOD_TYPE_CODE } from "../../../../../common/types/paymentMethods";
import { PERMIT_STATUSES } from "../../../types/PermitStatus";
import { RefundFormData } from "../../Refund/types/RefundFormData";
import {
  RevokePermitRequestData,
  VoidPermitFormData,
  VoidPermitRequestData,
} from "../types/VoidPermit";

export const mapToRevokeRequestData = (
  voidPermitFormData: VoidPermitFormData,
): RevokePermitRequestData => {
  return {
    status: PERMIT_STATUSES.REVOKED,
    paymentMethodTypeCode: PAYMENT_METHOD_TYPE_CODE.WEB, // hardcoded to "WEB" for revoke
    transactionAmount: 0,
    comment: voidPermitFormData.reason,
  };
};

export const mapToVoidRequestData = (
  voidPermitFormData: VoidPermitFormData,
  refundData: RefundFormData,
  amountToRefund: number,
): VoidPermitRequestData => {
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

  return {
    status: PERMIT_STATUSES.VOIDED,
    pgTransactionId: refundData.transactionId,
    paymentMethodTypeCode: getRefundMethodType(),
    transactionAmount: amountToRefund,
    pgPaymentMethod: refundData.refundOnlineMethod
      ? refundData.refundOnlineMethod
      : undefined,
    pgCardType: getRefundCardType(),
    comment: voidPermitFormData.reason,
  };
};
