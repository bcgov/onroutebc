export interface RefundVoidDto {
  shouldUsePrevPaymentMethod: boolean;
  paymentMethod: string; // should later change this to enum
  transactionId?: string;
}
