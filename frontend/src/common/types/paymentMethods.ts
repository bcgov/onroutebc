/**
 * The payment method type codes.
 */
export const PAYMENT_METHOD_TYPE_CODE = {
  CASH: "CASH",
  CHEQUE: "CHEQUE",
  ACCOUNT: "ACCOUNT",
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
  ACCOUNT: "Credit Account",
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
  VI: "VI", // Visa
  MC: "MC", // MasterCard
  AM: "AM", // American Express
  PV: "PV", // Visa Debit
  MD: "MD", // Debit MasterCard
  DB: "DB", // Debit
} as const;

export type PaymentCardTypeCode =
  (typeof PAYMENT_CARD_TYPE_CODE)[keyof typeof PAYMENT_CARD_TYPE_CODE];

/**
 * The card types
 */
export const PAYMENT_CARD_TYPE_DISPLAY = {
  AM: "Amex",
  PV: "Visa (Debit)",
  VI: "Visa",
  MC: "Mastercard",
  MD: "Mastercard (Debit)",
  DB: "Debit",
} as const;

export type PaymentCardTypeDisplay =
  (typeof PAYMENT_CARD_TYPE_DISPLAY)[keyof typeof PAYMENT_CARD_TYPE_DISPLAY];

export const PAYMENT_METHODS_WITH_CARD: PaymentMethodTypeCode[] = [
  PAYMENT_METHOD_TYPE_CODE.ICEPAY,
  PAYMENT_METHOD_TYPE_CODE.WEB,
  PAYMENT_METHOD_TYPE_CODE.POS,
];

export type PaymentMethodWithCard = Extract<
  PaymentMethodTypeCode,
  | typeof PAYMENT_METHOD_TYPE_CODE.ICEPAY
  | typeof PAYMENT_METHOD_TYPE_CODE.WEB
  | typeof PAYMENT_METHOD_TYPE_CODE.POS
>;

export type PaymentMethodDisplayWithCard =
  (typeof PAYMENT_METHOD_TYPE_DISPLAY)[PaymentMethodWithCard];

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
    paymentMethodTypeCode: PAYMENT_METHOD_TYPE_CODE.ACCOUNT,
  },
  "GA Payment": {
    paymentMethodTypeCode: PAYMENT_METHOD_TYPE_CODE.GA,
  },
  "IcePay - Amex": {
    paymentMethodTypeCode: PAYMENT_METHOD_TYPE_CODE.ICEPAY,
    paymentCardTypeCode: PAYMENT_CARD_TYPE_CODE.AM,
  },
  "IcePay - Mastercard": {
    paymentMethodTypeCode: PAYMENT_METHOD_TYPE_CODE.ICEPAY,
    paymentCardTypeCode: PAYMENT_CARD_TYPE_CODE.MC,
  },
  "IcePay - Mastercard (Debit)": {
    paymentMethodTypeCode: PAYMENT_METHOD_TYPE_CODE.ICEPAY,
    paymentCardTypeCode: PAYMENT_CARD_TYPE_CODE.MD,
  },
  "IcePay - Visa": {
    paymentMethodTypeCode: PAYMENT_METHOD_TYPE_CODE.ICEPAY,
    paymentCardTypeCode: PAYMENT_CARD_TYPE_CODE.VI,
  },
  "IcePay - Visa (Debit)": {
    paymentMethodTypeCode: PAYMENT_METHOD_TYPE_CODE.ICEPAY,
    paymentCardTypeCode: PAYMENT_CARD_TYPE_CODE.PV,
  },
  "PoS - Amex": {
    paymentMethodTypeCode: PAYMENT_METHOD_TYPE_CODE.POS,
    paymentCardTypeCode: PAYMENT_CARD_TYPE_CODE.AM,
  },
  "PoS - Debit": {
    paymentMethodTypeCode: PAYMENT_METHOD_TYPE_CODE.POS,
    paymentCardTypeCode: PAYMENT_CARD_TYPE_CODE.DB,
  },
  "PoS - Mastercard": {
    paymentMethodTypeCode: PAYMENT_METHOD_TYPE_CODE.POS,
    paymentCardTypeCode: PAYMENT_CARD_TYPE_CODE.MC,
  },
  "PoS - Mastercard (Debit)": {
    paymentMethodTypeCode: PAYMENT_METHOD_TYPE_CODE.POS,
    paymentCardTypeCode: PAYMENT_CARD_TYPE_CODE.MD,
  },
  "PoS - Visa": {
    paymentMethodTypeCode: PAYMENT_METHOD_TYPE_CODE.POS,
    paymentCardTypeCode: PAYMENT_CARD_TYPE_CODE.VI,
  },
  "PoS - Visa (Debit)": {
    paymentMethodTypeCode: PAYMENT_METHOD_TYPE_CODE.POS,
    paymentCardTypeCode: PAYMENT_CARD_TYPE_CODE.PV,
  },
  "Web - Amex": {
    paymentMethodTypeCode: PAYMENT_METHOD_TYPE_CODE.WEB,
    paymentCardTypeCode: PAYMENT_CARD_TYPE_CODE.AM,
  },
  "Web - Mastercard": {
    paymentMethodTypeCode: PAYMENT_METHOD_TYPE_CODE.WEB,
    paymentCardTypeCode: PAYMENT_CARD_TYPE_CODE.MC,
  },
  "Web - Mastercard (Debit)": {
    paymentMethodTypeCode: PAYMENT_METHOD_TYPE_CODE.WEB,
    paymentCardTypeCode: PAYMENT_CARD_TYPE_CODE.MD,
  },
  "Web - Visa": {
    paymentMethodTypeCode: PAYMENT_METHOD_TYPE_CODE.WEB,
    paymentCardTypeCode: PAYMENT_CARD_TYPE_CODE.VI,
  },
  "Web - Visa (Debit)": {
    paymentMethodTypeCode: PAYMENT_METHOD_TYPE_CODE.WEB,
    paymentCardTypeCode: PAYMENT_CARD_TYPE_CODE.PV,
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
  paymentMethod: PaymentMethodDisplayWithCard,
  paymentCard: PaymentCardTypeDisplay,
): string => paymentMethod + " - " + paymentCard;

export const getPaymentMethod = (
  paymentMethod: PaymentMethodTypeCode,
  paymentCard?: PaymentCardTypeCode | null,
): string => {
  if (!paymentCard || !PAYMENT_METHODS_WITH_CARD.includes(paymentMethod)) {
    return PAYMENT_METHOD_TYPE_DISPLAY[paymentMethod];
  }

  return getConsolidatedPaymentMethod(
    PAYMENT_METHOD_TYPE_DISPLAY[paymentMethod] as PaymentMethodDisplayWithCard,
    PAYMENT_CARD_TYPE_DISPLAY[paymentCard],
  );
};
