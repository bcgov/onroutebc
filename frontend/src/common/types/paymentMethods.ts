export const PAYMENT_METHOD_TYPE = {
  Cash: "Cash",
  Cheque: "Cheque",
  CreditAccount: "Credit Account",
  GA: "GA Payment",
  IcePay: "IcePay",
  PoS: "PoS",
  Web: "Web",
} as const;

export type PaymentMethodTypeAsEnum =
  (typeof PAYMENT_METHOD_TYPE)[keyof typeof PAYMENT_METHOD_TYPE];

/**
 * The payment types (contains different card types)
 */
export const PAYMENT_TYPE = {
  AMEX: { ccc: "AMEX" },
  VISA_DEBIT: "Visa (Debit)",
  VISA: "Cheque",
  MASTERCARD: "Mastercard",
  MASTERCARD_DEBIT: "Mastercard (Debit)",
  DEBIT: "Debit",
} as const;

export type PaymentTypeAsEnum =
  (typeof PAYMENT_METHOD_TYPE)[keyof typeof PAYMENT_METHOD_TYPE];

/**
 * The set of payment method types
 */
export type PaymentMethodTypeId =
  | "ACCOUNT"
  | "GA"
  | "CASH"
  | "CHEQUE"
  | "POS"
  | "WEB"
  | "ICEPAY";

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
export type PaymentTypeId = "AM" | "PV" | "MC" | "MD" | "VI" | "DB";

/**
 * An object containing the PaymentMethodTypeId and PaymentTypeId values.
 *
 */
export type PaymentMethodAndPaymentType = {
  paymentMethodTypeId: PaymentMethodTypeId;
  /**
   * This field is named as paymentType instead of paymentTypeId to
   * remain consistent with backend.
   */
  paymentType?: PaymentTypeId;
};

/**
 * The following record contains key value pairs for Payment Methods
 * and their associated paymentMethodType and paymentType values.
 */
export const PaymentMethodAndTypeRecord: Record<
  string,
  PaymentMethodAndPaymentType
> = {
  Cash: {
    paymentMethodTypeId: "CASH",
  },
  Cheque: {
    paymentMethodTypeId: "CHEQUE",
  },
  "Credit Account": {
    paymentMethodTypeId: "ACCOUNT",
  },
  "GA Payment": {
    paymentMethodTypeId: "GA",
  },
  "IcePay - AMEX": {
    paymentMethodTypeId: "ICEPAY",
    paymentType: "AM",
  },
  "IcePay - Mastercard": {
    paymentMethodTypeId: "ICEPAY",
    paymentType: "MC",
  },
  "IcePay - Mastercard (Debit)": {
    paymentMethodTypeId: "ICEPAY",
    paymentType: "MD",
  },
  "IcePay - Visa": {
    paymentMethodTypeId: "ICEPAY",
    paymentType: "VI",
  },
  "IcePay - Visa (Debit)": {
    paymentMethodTypeId: "ICEPAY",
    paymentType: "PV",
  },
  "PoS - AMEX": {
    paymentMethodTypeId: "POS",
    paymentType: "AM",
  },
  "PoS - Debit": {
    paymentMethodTypeId: "POS",
    paymentType: "DB",
  },
  "PoS - Mastercard": {
    paymentMethodTypeId: "POS",
    paymentType: "MC",
  },
  "PoS - Mastercard (Debit)": {
    paymentMethodTypeId: "POS",
    paymentType: "MD",
  },
  "PoS - Visa": {
    paymentMethodTypeId: "POS",
    paymentType: "VI",
  },
  "PoS - Visa (Debit)": {
    paymentMethodTypeId: "POS",
    paymentType: "PV",
  },
  "Web - AMEX": {
    paymentMethodTypeId: "WEB",
    paymentType: "AM",
  },
  "Web - Mastercard": {
    paymentMethodTypeId: "WEB",
    paymentType: "MC",
  },
  "Web - Mastercard (Debit)": {
    paymentMethodTypeId: "WEB",
    paymentType: "MD",
  },
  "Web - Visa": {
    paymentMethodTypeId: "WEB",
    paymentType: "VI",
  },
  "Web - Visa (Debit)": {
    paymentMethodTypeId: "WEB",
    paymentType: "PV",
  },
};
