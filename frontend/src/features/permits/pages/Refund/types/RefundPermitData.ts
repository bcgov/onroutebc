import {
  PaymentCardTypeCode,
  PaymentGatewayMethod,
  PaymentMethodTypeCode,
} from "../../../../../common/types/paymentMethods";

interface RefundTransactionItem {
  pgTransactionId: string;
  pgPaymentMethod: PaymentGatewayMethod;
  transactionAmount: number;
  paymentMethodTypeCode: PaymentMethodTypeCode;
  paymentCardTypeCode: PaymentCardTypeCode;
}

export interface RefundPermitData {
  applicationId: string;
  transactions: RefundTransactionItem[];
}
