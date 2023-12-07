import { PaymentGatewayMethod } from "../../../../../common/types/paymentMethods";

export interface RefundFormData {
  shouldUsePrevPaymentMethod: boolean;
  refundMethod: string;
  refundOnlineMethod: PaymentGatewayMethod | "";
  transactionId?: string;
}
