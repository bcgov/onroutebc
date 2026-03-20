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
  | PaymentMethodType.ICEPAY
  | PaymentMethodType.CASH
  | PaymentMethodType.CHEQUE
  | PaymentMethodType.GA
  | PaymentMethodType.POS
>;

export const CfsPaymentMethodType = {
  [PaymentMethodType.ICEPAY]: PaymentMethodType.ICEPAY,
  [PaymentMethodType.CASH]: PaymentMethodType.CASH,
  [PaymentMethodType.CHEQUE]: PaymentMethodType.CHEQUE,
  [PaymentMethodType.GA]: PaymentMethodType.GA,
  [PaymentMethodType.POS]: PaymentMethodType.POS,
} as const;
