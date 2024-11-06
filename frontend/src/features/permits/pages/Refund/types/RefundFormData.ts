import { PaymentGatewayMethod } from "../../../../../common/types/paymentMethods";
import { PermitHistory } from "../../../types/PermitHistory";

export interface RefundFormData {
  shouldUsePrevPaymentMethod: boolean;
  refundMethod: string;
  refundOnlineMethod: PaymentGatewayMethod | "";
  transactionId?: string;
}

export interface MultiplePaymentMethodRefundData extends PermitHistory {
  refundAmount: string;
  refundTransactionId: string;
  chequeRefund: boolean;
}

// export interface MultiplePaymentMethodRefundFormData {
//   refundData: MultiplePaymentMethodRefundData[];
// }

// export interface PermitHistoryWithRefund
//   extends PermitHistory,
//     MultiplePaymentMethodRefundFormData {}
