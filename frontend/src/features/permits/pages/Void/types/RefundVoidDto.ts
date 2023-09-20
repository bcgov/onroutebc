import { RefundMethod } from "../../../types/PaymentMethod";

export interface RefundVoidDto {
  shouldUsePrevPaymentMethod: boolean;
  refundMethod: RefundMethod;
  transactionId?: string;
}
