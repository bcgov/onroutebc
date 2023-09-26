export interface MotiPaymentDetails {
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
  paymentMethod: string;
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

export interface TransactionDto {
  paymentMethodId: string;
  transactionAmount: string;
  transactionOrderNumber: string;
  transactionSubmitDate: string;
  transactionType: TransactionType;
  url?: string;
}
