import { RefundMethod } from "../../../types/PaymentMethod";

export interface RefundFormData {
  shouldUsePrevPaymentMethod: boolean;
  refundMethod: RefundMethod;
  transactionId?: string;
}
