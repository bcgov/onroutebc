export enum PaymentMethodType {
  WEB = 'WEB',
  ICEPAY = 'ICEPAY',
  ACCOUNT = 'ACCOUNT',
  GA = 'GA',
  CASH = 'CASH',
  CHEQUE = 'CHEQUE',
  POS = 'POS',
  NO_PAYMENT = 'NP',
}

export enum ExtendedPaymentMethodType {
  ALL = 'ALL',
}

export const PaymentMethodTypeReport = {
  ...PaymentMethodType,
  ...ExtendedPaymentMethodType,
};

export type PaymentMethodTypeReport =
  (typeof PaymentMethodTypeReport)[keyof typeof PaymentMethodTypeReport];

//export type PaymentMethodTypeReport =  keyof typeof PaymentMethodTypeReport;

export type CfsPaymentMethodType = Extract<
  PaymentMethodType,
  PaymentMethodType.ICEPAY | PaymentMethodType.CASH | PaymentMethodType.CHEQUE
>;

export const CfsPaymentMethodType = {
  [PaymentMethodType.ICEPAY]: PaymentMethodType.ICEPAY,
  [PaymentMethodType.CASH]: PaymentMethodType.CASH,
  [PaymentMethodType.CHEQUE]: PaymentMethodType.CHEQUE,
} as const;

/**
 * Transaction type eligible for GARMS Cash file
 */
export const GARMS_CASH_FILE_TRANSACTION_TYPE: readonly PaymentMethodType[] = [
  PaymentMethodType.CASH,
  PaymentMethodType.CHEQUE,
  PaymentMethodType.GA,
  PaymentMethodType.ICEPAY,
  PaymentMethodType.POS,
];

/**
 * Transaction type eligible for GARMS Credit file
 */
export const GARMS_CREDIT_FILE_TRANSACTION_TYPE: readonly PaymentMethodType[] =
  [PaymentMethodType.ACCOUNT];
