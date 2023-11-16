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
    paymentMethodId: "1", // hardcoded to "1" - Web
    transactionAmount: 0,
    comment: voidPermitFormData.reason,
  };
};

export const mapToVoidRequestData = (
  voidPermitFormData: VoidPermitFormData,
  refundData: RefundFormData,
  amountToRefund: number,
): VoidPermitRequestData => {
  return {
    status: PERMIT_STATUSES.VOIDED,
    pgTransactionId: refundData.transactionId,
    paymentMethodId: "1", // hardcoded to "1" - Web
    transactionAmount: amountToRefund,
    pgPaymentMethod: refundData.refundOnlineMethod
      ? refundData.refundOnlineMethod
      : undefined,
    pgCardType: refundData.refundCardType
      ? refundData.refundCardType
      : undefined,
    comment: voidPermitFormData.reason,
  };
};
