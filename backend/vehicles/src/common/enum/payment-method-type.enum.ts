export enum PaymentMethodType {
  WEB = '1',
  WEB_AM = '2',
  WEB_MC = '3',
  WEB_VI = '4',
  WEB_PV = '5',
  WEB_MD = '6',
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
