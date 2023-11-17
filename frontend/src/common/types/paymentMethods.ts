/**
 * The payment method type codes.
 */
export const PAYMENT_METHOD_TYPE_CODE = {
  CASH: "CASH",
  CHEQUE: "CHEQUE",
  CREDIT_ACCOUNT: "ACCOUNT",
  GA: "GA",
  ICEPAY: "ICEPAY",
  POS: "POS",
  WEB: "WEB",
} as const;

/**
 * The enum type for payment method type codes.
 */
export type PaymentMethodTypeCode =
  (typeof PAYMENT_METHOD_TYPE_CODE)[keyof typeof PAYMENT_METHOD_TYPE_CODE];

/**
 * The payment method display values useful displaying in the frontend.
 */
export const PAYMENT_METHOD_TYPE_DISPLAY = {
  CASH: "Cash",
  CHEQUE: "Cheque",
  CREDIT_ACCOUNT: "Credit Account",
  GA: "GA Payment",
  ICEPAY: "IcePay",
  POS: "PoS",
  WEB: "Web",
} as const;

/**
 * The enum type for payment method type display strings.
 */
export type PaymentMethodTypeDisplay =
  (typeof PAYMENT_METHOD_TYPE_DISPLAY)[keyof typeof PAYMENT_METHOD_TYPE_DISPLAY];

export const PAYMENT_CARD_TYPE_CODE = {
  VISA: "VI", // Visa
  MASTERCARD: "MC", // MasterCard
  AMEX: "AM", // American Express
  VISA_DEBIT: "PV", // Visa Debit
  MASTERCARD_DEBIT: "MD", // Debit MasterCard
  DEBIT: "DB", // Debit
} as const;

export type PaymentCardTypeCode =
  (typeof PAYMENT_CARD_TYPE_CODE)[keyof typeof PAYMENT_CARD_TYPE_CODE];

/**
 * The card types
 */
export const PAYMENT_CARD_TYPE_DISPLAY = {
  AMEX: "Amex",
  VISA_DEBIT: "Visa (Debit)",
  VISA: "Visa",
  MASTERCARD: "Mastercard",
  MASTERCARD_DEBIT: "Mastercard (Debit)",
  DEBIT: "Debit",
} as const;

export type PaymentCardTypeDisplay =
  (typeof PAYMENT_CARD_TYPE_DISPLAY)[keyof typeof PAYMENT_CARD_TYPE_DISPLAY];

/**
 * An object containing the paymentMethodTypeCode and paymentCardTypeCode values.
 */
export type PaymentMethodAndCardTypeCodes = {
  /**
   * The payment method type code.
   * (not to be confused with PaymentMethodTypeDisplay)
   */
  paymentMethodTypeCode: PaymentMethodTypeCode;
  /**
   * The two letter card type code.
   * (not to be confused with PaymentCardTypeDisplay)
   */
  paymentCardTypeCode?: PaymentCardTypeCode;
};

/**
 * The following record contains key value pairs for Payment Methods
 * and their associated paymentMethodType and paymentType values.
 */
export const CONSOLIDATED_PAYMENT_METHODS: Record<
  string,
  PaymentMethodAndCardTypeCodes
> = {
  Cash: {
    paymentMethodTypeCode: PAYMENT_METHOD_TYPE_CODE.CASH,
  },
  Cheque: {
    paymentMethodTypeCode: PAYMENT_METHOD_TYPE_CODE.CHEQUE,
  },
  "Credit Account": {
    paymentMethodTypeCode: PAYMENT_METHOD_TYPE_CODE.CREDIT_ACCOUNT,
  },
  "GA Payment": {
    paymentMethodTypeCode: PAYMENT_METHOD_TYPE_CODE.GA,
  },
  "IcePay - Amex": {
    paymentMethodTypeCode: PAYMENT_METHOD_TYPE_CODE.ICEPAY,
    paymentCardTypeCode: PAYMENT_CARD_TYPE_CODE.AMEX,
  },
  "IcePay - Mastercard": {
    paymentMethodTypeCode: PAYMENT_METHOD_TYPE_CODE.ICEPAY,
    paymentCardTypeCode: PAYMENT_CARD_TYPE_CODE.MASTERCARD,
  },
  "IcePay - Mastercard (Debit)": {
    paymentMethodTypeCode: PAYMENT_METHOD_TYPE_CODE.ICEPAY,
    paymentCardTypeCode: PAYMENT_CARD_TYPE_CODE.MASTERCARD_DEBIT,
  },
  "IcePay - Visa": {
    paymentMethodTypeCode: PAYMENT_METHOD_TYPE_CODE.ICEPAY,
    paymentCardTypeCode: PAYMENT_CARD_TYPE_CODE.VISA,
  },
  "IcePay - Visa (Debit)": {
    paymentMethodTypeCode: PAYMENT_METHOD_TYPE_CODE.ICEPAY,
    paymentCardTypeCode: PAYMENT_CARD_TYPE_CODE.VISA_DEBIT,
  },
  "PoS - Amex": {
    paymentMethodTypeCode: PAYMENT_METHOD_TYPE_CODE.POS,
    paymentCardTypeCode: PAYMENT_CARD_TYPE_CODE.AMEX,
  },
  "PoS - Debit": {
    paymentMethodTypeCode: PAYMENT_METHOD_TYPE_CODE.POS,
    paymentCardTypeCode: PAYMENT_CARD_TYPE_CODE.DEBIT,
  },
  "PoS - Mastercard": {
    paymentMethodTypeCode: PAYMENT_METHOD_TYPE_CODE.POS,
    paymentCardTypeCode: PAYMENT_CARD_TYPE_CODE.MASTERCARD,
  },
  "PoS - Mastercard (Debit)": {
    paymentMethodTypeCode: PAYMENT_METHOD_TYPE_CODE.POS,
    paymentCardTypeCode: PAYMENT_CARD_TYPE_CODE.MASTERCARD_DEBIT,
  },
  "PoS - Visa": {
    paymentMethodTypeCode: PAYMENT_METHOD_TYPE_CODE.POS,
    paymentCardTypeCode: PAYMENT_CARD_TYPE_CODE.VISA,
  },
  "PoS - Visa (Debit)": {
    paymentMethodTypeCode: PAYMENT_METHOD_TYPE_CODE.POS,
    paymentCardTypeCode: PAYMENT_CARD_TYPE_CODE.VISA_DEBIT,
  },
  "Web - Amex": {
    paymentMethodTypeCode: PAYMENT_METHOD_TYPE_CODE.WEB,
    paymentCardTypeCode: PAYMENT_CARD_TYPE_CODE.AMEX,
  },
  "Web - Mastercard": {
    paymentMethodTypeCode: PAYMENT_METHOD_TYPE_CODE.WEB,
    paymentCardTypeCode: PAYMENT_CARD_TYPE_CODE.MASTERCARD,
  },
  "Web - Mastercard (Debit)": {
    paymentMethodTypeCode: PAYMENT_METHOD_TYPE_CODE.WEB,
    paymentCardTypeCode: PAYMENT_CARD_TYPE_CODE.MASTERCARD_DEBIT,
  },
  "Web - Visa": {
    paymentMethodTypeCode: PAYMENT_METHOD_TYPE_CODE.WEB,
    paymentCardTypeCode: PAYMENT_CARD_TYPE_CODE.VISA,
  },
  "Web - Visa (Debit)": {
    paymentMethodTypeCode: PAYMENT_METHOD_TYPE_CODE.WEB,
    paymentCardTypeCode: PAYMENT_CARD_TYPE_CODE.VISA_DEBIT,
  },
};

/**
 * Generates a key for the {@link CONSOLIDATED_PAYMENT_METHODS} object.
 * The key follows this format: "{paymentMethod} - {paymentCard}"
 * 
 * @param paymentMethod One of "IcePay" | "PoS" | "Web" {@link PAYMENT_METHOD_TYPE_DISPLAY}
 * @param paymentCard A value from {@link PaymentCardTypeDisplay}
 * @returns string
 */
export const getConsolidatedPaymentMethod = (
  paymentMethod: Extract<PaymentMethodTypeDisplay, "IcePay" | "Web" | "PoS">,
  paymentCard: PaymentCardTypeDisplay,
): string => paymentMethod + " - " + paymentCard;
