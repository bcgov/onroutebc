import { BamboraPaymentMethod, CardType } from "./PaymentMethod";

export interface MotiPaymentDetails {
  authCode: string;
  avsAddrMatch: string;
  avsId: string;
  avsMessage: string;
  avsPostalMatch: string;
  avsProcessed: string;
  avsResult: string;
  cardType: CardType;
  cvdId: number;
  trnApproved: number;
  messageId: string;
  messageText: string;
  paymentMethod: BamboraPaymentMethod;
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

export interface Transaction {
  //transactionId: number;
  transactionType: string;
  transactionOrderNumber: string;
  providerTransactionId: number;
  transactionAmount: number;
  approved: number;
  authCode: string;
  cardType: string;
  transactionDate: string;
  cvdId: number;
  paymentMethod: string;
  paymentMethodId: number;
  messageId: string;
  messageText: string;
}

export interface PermitTransaction {
  permitId: string;
  transactionId: number;
}

export const TRANSACTION_TYPES = {
  P: "P",
  R: "R",
  VP: "VP", 
  VR: "VR", 
  PA: "PA", 
  PAC: "PAC", 
  Q: "Q",
  Z: "Z",
} as const;

export type TransactionType = typeof TRANSACTION_TYPES[keyof typeof TRANSACTION_TYPES];

export interface PaymentGatewayData {
  pgTransactionId: string;
  pgApproved: number;
  pgAuthCode: string;
  pgCardType: CardType;
  pgTransactionDate: string;
  pgCvdId: number;
  pgPaymentMethod: BamboraPaymentMethod;
  pgMessageId: number;
  pgMessageText: string;
}

export interface StartTransactionRequestData extends Partial<PaymentGatewayData> {
  transactionTypeId: TransactionType;
  paymentMethodId: string;
  applicationDetails: {
    applicationId: string;
    transactionAmount: number;
  }[];
}

export interface StartTransactionResponseData extends Partial<PaymentGatewayData> {
  transactionId: string;
  transactionTypeId: TransactionType;
  paymentMethodId: string;
  totalTransactionAmount: number;
  transactionSubmitDate: string;
  transactionOrderNumber: string;
  applicationDetails: {
    applicationId: string;
    transactionAmount: number;
  }[];
  url?: string;
}

export type CompleteTransactionRequestData = PaymentGatewayData;

export interface CompleteTransactionResponseData extends PaymentGatewayData {
  transactionid: string;
}
