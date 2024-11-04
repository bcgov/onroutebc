import { PaymentGatewayMethod } from "../../../../../common/types/paymentMethods";
import { PermitHistory } from "../../../types/PermitHistory";

export interface RefundFormData {
  shouldUsePrevPaymentMethod: boolean;
  refundMethod: string;
  refundOnlineMethod: PaymentGatewayMethod | "";
  transactionId?: string;
}

export interface MultiplePaymentMethodRefundRowData {
  refundAmount: string;
  refundTransactionId: string;
  chequeRefund: boolean;
}

export interface MultiplePaymentMethodRefundFormData {
  refundData: MultiplePaymentMethodRefundRowData[];
}

export interface PermitHistoryWithRefund
  extends PermitHistory,
    MultiplePaymentMethodRefundRowData {}
