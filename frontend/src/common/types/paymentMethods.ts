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
  AMEX: "AMEX",
  VISA_DEBIT: "Visa (Debit)",
  VISA: "Visa",
  MASTERCARD: "Mastercard",
  MASTERCARD_DEBIT: "Mastercard (Debit)",
  DEBIT: "Debit",
} as const;

export type PaymentTypeAsEnum =
  (typeof PAYMENT_METHOD_TYPE)[keyof typeof PAYMENT_METHOD_TYPE];

/**
 * The set of payment method types
 */
export type PaymentMethodTypeCode =
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
export type PaymentTypeCode = "AM" | "PV" | "MC" | "MD" | "VI" | "DB";

/**
 * An object containing the PaymentMethodTypeId and PaymentTypeId values.
 *
 */
export type PaymentMethodAndPaymentType = {
  paymentMethodTypeCode: PaymentMethodTypeCode;
  /**
   * This field is named as paymentType instead of paymentTypeId to
   * remain consistent with backend.
   */
  paymentTypeCode?: PaymentTypeCode;
};
