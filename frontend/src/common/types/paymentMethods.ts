export const PAYMENT_METHOD_TYPE_DISPLAY = {
  Cash: "Cash",
  Cheque: "Cheque",
  CreditAccount: "Credit Account",
  GA: "GA Payment",
  IcePay: "IcePay",
  PoS: "PoS",
  Web: "Web",
} as const;

export type PaymentMethodTypeDisplay =
  (typeof PAYMENT_METHOD_TYPE_DISPLAY)[keyof typeof PAYMENT_METHOD_TYPE_DISPLAY];

/**
 * The payment types (contains different card types)
 */
export const PAYMENT_TYPE_DISPLAY = {
  AMEX: "Amex",
  VISA_DEBIT: "Visa (Debit)",
  VISA: "Visa",
  MASTERCARD: "Mastercard",
  MASTERCARD_DEBIT: "Mastercard (Debit)",
  DEBIT: "Debit",
} as const;

export type PaymentTypeAsEnum =
  (typeof PAYMENT_METHOD_TYPE_DISPLAY)[keyof typeof PAYMENT_METHOD_TYPE_DISPLAY];

/**
 * An object containing the paymentMethodTypeCode and PaymentTypeId values.
 *
 */
export type PaymentMethodAndPaymentTypeCodes = {
  paymentMethodTypeCode: PaymentMethodTypeCode;
  /**
   * This field is named as paymentType instead of paymentTypeId to
   * remain consistent with backend.
   */
  paymentTypeCode?: PaymentTypeCode;
};

export const PAYMENT_TYPE_CODE = {
  VI: "VI", // Visa
  MC: "MC", // MasterCard
  AM: "AM", // American Express
  PV: "PV", // Visa Debit
  MD: "MD", // Debit MasterCard
  DB: "DB", // Interac Online
} as const;

/**
 * Glossary:
 *
 * AM - AMEX
 * VI - Visa
 * PV - Visa Debit
 * MC - Mastercard
 * MD - Mastercard Debit
 * DB - Debit
 */
export type PaymentTypeCode =
  (typeof PAYMENT_TYPE_CODE)[keyof typeof PAYMENT_TYPE_CODE];

export const PAYMENT_METHOD_TYPE_CODE = {
  Cash: "CASH",
  Cheque: "CHEQUE",
  CreditAccount: "ACCOUNT",
  GA: "GA",
  IcePay: "ICEPAY",
  PoS: "POS",
  Web: "WEB",
} as const;

/**
 * The set of payment method types
 */
export type PaymentMethodTypeCode =
  (typeof PAYMENT_METHOD_TYPE_CODE)[keyof typeof PAYMENT_METHOD_TYPE_CODE];

/**
 * The following record contains key value pairs for Payment Methods
 * and their associated paymentMethodType and paymentType values.
 */
export const PaymentMethodAndTypeRecord: Record<
  string,
  PaymentMethodAndPaymentTypeCodes
> = {
  Cash: {
    paymentMethodTypeCode: PAYMENT_METHOD_TYPE_CODE.Cash,
  },
  Cheque: {
    paymentMethodTypeCode: "CHEQUE",
  },
  "Credit Account": {
    paymentMethodTypeCode: "ACCOUNT",
  },
  "GA Payment": {
    paymentMethodTypeCode: "GA",
  },
  "IcePay - AMEX": {
    paymentMethodTypeCode: "ICEPAY",
    paymentTypeCode: "AM",
  },
  "IcePay - Mastercard": {
    paymentMethodTypeCode: "ICEPAY",
    paymentTypeCode: "MC",
  },
  "IcePay - Mastercard (Debit)": {
    paymentMethodTypeCode: "ICEPAY",
    paymentTypeCode: "MD",
  },
  "IcePay - Visa": {
    paymentMethodTypeCode: "ICEPAY",
    paymentTypeCode: "VI",
  },
  "IcePay - Visa (Debit)": {
    paymentMethodTypeCode: "ICEPAY",
    paymentTypeCode: "PV",
  },
  "PoS - AMEX": {
    paymentMethodTypeCode: "POS",
    paymentTypeCode: "AM",
  },
  "PoS - Debit": {
    paymentMethodTypeCode: "POS",
    paymentTypeCode: "DB",
  },
  "PoS - Mastercard": {
    paymentMethodTypeCode: "POS",
    paymentTypeCode: "MC",
  },
  "PoS - Mastercard (Debit)": {
    paymentMethodTypeCode: "POS",
    paymentTypeCode: "MD",
  },
  "PoS - Visa": {
    paymentMethodTypeCode: "POS",
    paymentTypeCode: "VI",
  },
  "PoS - Visa (Debit)": {
    paymentMethodTypeCode: "POS",
    paymentTypeCode: "PV",
  },
  "Web - AMEX": {
    paymentMethodTypeCode: "WEB",
    paymentTypeCode: "AM",
  },
  "Web - Mastercard": {
    paymentMethodTypeCode: "WEB",
    paymentTypeCode: "MC",
  },
  "Web - Mastercard (Debit)": {
    paymentMethodTypeCode: "WEB",
    paymentTypeCode: "MD",
  },
  "Web - Visa": {
    paymentMethodTypeCode: "WEB",
    paymentTypeCode: "VI",
  },
  "Web - Visa (Debit)": {
    paymentMethodTypeCode: "WEB",
    paymentTypeCode: "PV",
  },
};
