import {
  PaymentCardTypeCode,
  PaymentGatewayMethod,
  PaymentMethodTypeCode,
} from "../../../../../common/types/paymentMethods";

interface RefundTransactionItem {
  paymentMethodTypeCode: PaymentMethodTypeCode;
  paymentCardTypeCode: PaymentCardTypeCode;
  pgCardType: PaymentCardTypeCode;
  pgTransactionId: string;
  pgPaymentMethod: PaymentGatewayMethod;
  transactionAmount: number;
}

export interface RefundPermitData {
  applicationId: string;
  transactions: RefundTransactionItem[];
}
