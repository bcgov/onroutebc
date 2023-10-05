export const PAYMENT_METHODS = {
  Cash: "Cash",
  Cheque: "Cheque",
  CreditAccount: "CreditAccount",
  GA: "GA",
  IcepayAMEX: "IcepayAMEX",
  IcepayDebit: "IcepayDebit",
  IcepayMastercard: "IcepayMastercard",
  IcepayMastercardDebit: "IcepayMastercardDebit",
  IcepayVisa: "IcepayVisa",
  IcepayVisaDebit: "IcepayVisaDebit",
  PoSAMEX: "PoSAMEX",
  PoSDebit: "PoSDebit",
  PoSMastercard: "PoSMastercard",
  PoSMastercardDebit: "PoSMastercardDebit",
  PoSVisa: "PoSVisa",
  PoSVisaDebit: "PoSVisaDebit",
  WebAMEX: "WebAMEX",
  WebMastercard: "WebMastercard",
  WebMastercardDebit: "WebMastercardDebit",
  WebVisa: "WebVisa",
  WebVisaDebit: "WebVisaDebit",
} as const;

export type PaymentMethod = typeof PAYMENT_METHODS[keyof typeof PAYMENT_METHODS];

export const REFUND_METHODS = {
  Cheque: "Cheque",
  CreditAccount: "CreditAccount",
  PPCAMEX: "PPCAMEX",
  PPCDebit: "PPCDebit",
  PPCMastercard: "PPCMastercard",
  PPCMastercardDebit: "PPCMastercardDebit",
  PPCVisa: "PPCVisa",
  PPCVisaDebit: "PPCVisaDebit",
} as const;

export type RefundMethod = typeof REFUND_METHODS[keyof typeof REFUND_METHODS];

export const paymentMethodDisplayText = (paymentMethod: PaymentMethod) => {
  switch (paymentMethod) {
    case PAYMENT_METHODS.Cash:
      return "Cash";
    case PAYMENT_METHODS.Cheque:
      return "Cheque";
    case PAYMENT_METHODS.CreditAccount:
      return "Credit Account";
    case PAYMENT_METHODS.GA:
      return "GA Payment";
    case PAYMENT_METHODS.IcepayAMEX:
      return "Icepay - AMEX";
    case PAYMENT_METHODS.IcepayDebit:
      return "Icepay - Debit";
    case PAYMENT_METHODS.IcepayMastercard:
      return "Icepay - Mastercard";
    case PAYMENT_METHODS.IcepayMastercardDebit:
      return "Icepay - Mastercard (Debit)";
    case PAYMENT_METHODS.IcepayVisa:
      return "Icepay - Visa";
    case PAYMENT_METHODS.IcepayVisaDebit:
      return "Icepay - Visa (Debit)";
    case PAYMENT_METHODS.PoSAMEX:
      return "PoS - AMEX";
    case PAYMENT_METHODS.PoSDebit:
      return "PoS - Debit";
    case PAYMENT_METHODS.PoSMastercard:
      return "PoS - Mastercard";
    case PAYMENT_METHODS.PoSMastercardDebit:
      return "PoS - Mastercard (Debit)";
    case PAYMENT_METHODS.PoSVisa:
      return "PoS - Visa";
    case PAYMENT_METHODS.PoSVisaDebit:
      return "PoS - Visa (Debit)";
    case PAYMENT_METHODS.WebAMEX:
      return "Web - AMEX";
    case PAYMENT_METHODS.WebMastercard:
      return "Web - Mastercard";
    case PAYMENT_METHODS.WebMastercardDebit:
      return "Web - Mastercard (Debit)";
    case PAYMENT_METHODS.WebVisa:
      return "Web - Visa";
    case PAYMENT_METHODS.WebVisaDebit:
      return "Web - Visa (Debit)";
  }
};

export const refundMethodDisplayText = (refundMethod: RefundMethod) => {
  switch (refundMethod) {
    case REFUND_METHODS.Cheque:
      return "Cheque";
    case REFUND_METHODS.CreditAccount:
      return "Credit Account";
    case REFUND_METHODS.PPCAMEX:
      return "PPC - AMEX";
    case REFUND_METHODS.PPCDebit:
      return "PPC - Debit";
    case REFUND_METHODS.PPCMastercard:
      return "PPC - Mastercard";
    case REFUND_METHODS.PPCMastercardDebit:
      return "PPC - Mastercard (Debit)";
    case REFUND_METHODS.PPCVisa:
      return "PPC - Visa";
    case REFUND_METHODS.PPCVisaDebit:
      return "PPC - Visa (Debit)";
  }
};

export const mapPaymentMethodToRefundMethods = (paymentMethod: PaymentMethod, useCreditAccount?: boolean): RefundMethod => {
  switch (paymentMethod) {
    case PAYMENT_METHODS.Cash: 
    case PAYMENT_METHODS.Cheque:
    case PAYMENT_METHODS.GA:
      return REFUND_METHODS.Cheque;
    case PAYMENT_METHODS.CreditAccount:
      return useCreditAccount ? REFUND_METHODS.CreditAccount : REFUND_METHODS.Cheque;
    case PAYMENT_METHODS.IcepayAMEX:
    case PAYMENT_METHODS.PoSAMEX:
    case PAYMENT_METHODS.WebAMEX:
      return REFUND_METHODS.PPCAMEX;
    case PAYMENT_METHODS.IcepayDebit:
    case PAYMENT_METHODS.PoSDebit:
      return REFUND_METHODS.PPCDebit;
    case PAYMENT_METHODS.IcepayMastercard:
    case PAYMENT_METHODS.PoSMastercard:
    case PAYMENT_METHODS.WebMastercard:
      return REFUND_METHODS.PPCMastercard;
    case PAYMENT_METHODS.IcepayMastercardDebit:
    case PAYMENT_METHODS.PoSMastercardDebit:
    case PAYMENT_METHODS.WebMastercardDebit:
      return REFUND_METHODS.PPCMastercardDebit;
    case PAYMENT_METHODS.IcepayVisa:
    case PAYMENT_METHODS.PoSVisa:
    case PAYMENT_METHODS.WebVisa:
      return REFUND_METHODS.PPCVisa;
    case PAYMENT_METHODS.IcepayVisaDebit:
    case PAYMENT_METHODS.PoSVisaDebit:
    case PAYMENT_METHODS.WebVisaDebit:
      return REFUND_METHODS.PPCVisaDebit;
  }
};

export const BAMBORA_PAYMENT_METHODS = {
  CC: "CC", // Credit Card Transaction
  IO: "IO", // Interac Online Transaction
} as const;

export type BamboraPaymentMethod = typeof BAMBORA_PAYMENT_METHODS[keyof typeof BAMBORA_PAYMENT_METHODS];

export const CARD_TYPES = {
  VI: "VI", // Visa
  MC: "MC", // MasterCard
  AM: "AM", // American Express
  PV: "PV", // Visa Debit
  MD: "MD", // Debit MasterCard
  IO: "IO", // Interac Online
} as const;

export type CardType = typeof CARD_TYPES[keyof typeof CARD_TYPES];

// Incomplete, needs to confirm and change database schema for payment methods
// since it's insufficient to determine payment method through Bambora payment method and card type alone
export const getPaymentMethod = (
  payMethod?: BamboraPaymentMethod | null, 
  cardType?: CardType | null
): PaymentMethod | undefined => {
  if (payMethod !== BAMBORA_PAYMENT_METHODS.CC) {
    return undefined; // Could be either cash, cheque, GA, Credit Account, or Interac/Debit
  }

  // Paid by credit card
  switch (cardType) {
    case CARD_TYPES.AM:
      return PAYMENT_METHODS.WebAMEX;
    case CARD_TYPES.MC:
      return PAYMENT_METHODS.WebMastercard;
    case CARD_TYPES.MD:
      return PAYMENT_METHODS.WebMastercardDebit;
    case CARD_TYPES.PV:
      return PAYMENT_METHODS.WebVisaDebit;
    case CARD_TYPES.VI:
      return PAYMENT_METHODS.WebVisa;
    default:
      return undefined; // unknown value for Interac payment 
  }
};

export const getRefundMethodByCardType = (cardType?: CardType | null): RefundMethod => {
  switch (cardType) {
    case CARD_TYPES.AM:
      return REFUND_METHODS.PPCAMEX;
    case CARD_TYPES.MC:
      return REFUND_METHODS.PPCMastercard;
    case CARD_TYPES.MD:
      return REFUND_METHODS.PPCMastercardDebit;
    case CARD_TYPES.PV:
      return REFUND_METHODS.PPCVisaDebit;
    case CARD_TYPES.VI:
      return REFUND_METHODS.PPCVisa;
    default:
      return REFUND_METHODS.Cheque;
  }
};
