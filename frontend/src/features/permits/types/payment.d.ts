import {
  PaymentCardTypeCode,
  PaymentMethodTypeCode,
} from "../../../common/types/paymentMethods";
import { BamboraPaymentMethod } from "./PaymentMethod";

export interface PayBCPaymentDetails {
  authCode: string;
  avsAddrMatch: string;
  avsId: string;
  avsMessage: string;
  avsPostalMatch: string;
  avsProcessed: string;
  avsResult: string;
  cardType: string;
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

export type TransactionType =
  (typeof TRANSACTION_TYPES)[keyof typeof TRANSACTION_TYPES];

export interface PaymentGatewayData {
  pgTransactionId: string;
  pgApproved: number;
  pgAuthCode: string;
  pgCardType: PaymentCardTypeCode;
  pgTransactionDate: string;
  pgCvdId: number;
  pgPaymentMethod: BamboraPaymentMethod;
  pgMessageId: number;
  pgMessageText: string;
}

export interface StartTransactionRequestData
  extends Partial<PaymentGatewayData> {
  transactionTypeId: TransactionType;
  paymentMethodTypeCode: PaymentMethodTypeCode;
  paymentCardTypeCode?: PaymentCardTypeCode;
  applicationDetails: {
    applicationId: string;
    transactionAmount: number;
  }[];
}

export interface StartTransactionResponseData
  extends Partial<PaymentGatewayData> {
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

export type CompleteTransactionRequestData = Partial<PaymentGatewayData>;

export interface CompleteTransactionResponseData
  extends Partial<PaymentGatewayData> {
  transactionId: string;
}
