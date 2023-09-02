export interface RefundVoidDto {
  shouldUsePrevPaymentMethod: boolean;
  paymentMethod: number; // should later change this to enum
  transactionId?: string;
}
