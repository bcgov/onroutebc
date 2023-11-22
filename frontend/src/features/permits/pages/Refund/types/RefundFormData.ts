import { BamboraPaymentMethod } from "../../../types/PaymentMethod";

export interface RefundFormData {
  shouldUsePrevPaymentMethod: boolean;
  refundMethod: string;
  refundOnlineMethod: BamboraPaymentMethod | "";
  transactionId?: string;
}
