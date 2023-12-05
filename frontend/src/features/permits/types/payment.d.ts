import { 
  PaymentCardTypeCode, 
  PaymentMethodTypeCode,
  PaymentGatewayMethod,
} from "../../../common/types/paymentMethods";

export interface PayBCPaymentDetails {
  authCode?: string | null;
  avsAddrMatch: string;
  avsId: string;
  avsMessage: string;
  avsPostalMatch: string;
  avsProcessed: string;
  avsResult: string;
  cardType: string;
  cvdId?: number | null;
  trnApproved: number;
  messageId?: number | null;
  messageText: string;
  paymentMethod: PaymentGatewayMethod;
  ref1: string;
  ref2: string;
  ref3: string;
  ref4: string;
  ref5: string;
  responseType: string;
  trnAmount: number;
  trnCustomerName: string;
  trnDate: string;
  trnEmailAddress: string;
  trnId: string;
  trnLanguage: string;
  trnOrderNumber: string;
  trnPhoneNumber: string;
  trnType: string;
}

export const TRANSACTION_TYPES = {
  P: "P",
  R: "R",
  VP: "VP",
  VR: "VR",
  PA: "PA",
  PAC: "PAC",
  Q: "Q",
} as const;

export type TransactionType =
  (typeof TRANSACTION_TYPES)[keyof typeof TRANSACTION_TYPES];

type Optional<T> = { [P in keyof T]?: T[P] | null | undefined };

export interface PaymentGatewayData {
  pgTransactionId: string;
  pgApproved: number;
  pgAuthCode: string;
  pgCardType: PaymentCardTypeCode;
  pgTransactionDate: string;
  pgCvdId: number;
  pgPaymentMethod: PaymentGatewayMethod;
  pgMessageId: number;
  pgMessageText: string;
}

export interface StartTransactionRequestData
  extends Optional<PaymentGatewayData> {
  transactionTypeId: TransactionType;
  paymentMethodTypeCode: PaymentMethodTypeCode;
  paymentCardTypeCode?: PaymentCardTypeCode;
  applicationDetails: {
    applicationId: string;
    transactionAmount: number;
  }[];
}

export interface StartTransactionResponseData
  extends Optional<PaymentGatewayData> {
  transactionId: string;
  transactionTypeId: TransactionType;
  paymentMethodTypeCode: PaymentMethodTypeCode;
  paymentCardTypeCode?: PaymentCardTypeCode | null;
  totalTransactionAmount: number;
  transactionSubmitDate: string;
  transactionOrderNumber: string;
  applicationDetails: {
    applicationId: string;
    transactionAmount: number;
  }[];
  url?: string;
}

export type CompleteTransactionRequestData = Optional<PaymentGatewayData>;

export interface CompleteTransactionResponseData
  extends Optional<PaymentGatewayData> {
  transactionId: string;
}
