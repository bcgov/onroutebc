export type PaymentMethodType =
  | "ACCOUNT"
  | "GA"
  | "CASH"
  | "CHEQUE"
  | "POS"
  | "WEB"
  | "ICEPAY";

export type PaymentType = "AM" | "PV" | "MC" | "MD" | "VI";

export type PaymentMode = {
  paymentMethodTypeId: PaymentMethodType;
  paymentType?: PaymentType;
};

export type PaymentMethodsAndIds = {
  display: string;
  paymentMethodTypeId: PaymentMethodType;
  paymentType?: PaymentType;
  description?: string;
};

export const consolidatedArray: PaymentMethodsAndIds[] = [
  {
    display: "Credit Account",
    paymentMethodTypeId: "ACCOUNT",
  },
  {
    display: "GA Payment",
    paymentMethodTypeId: "GA",
  },
  {
    display: "Cash",
    paymentMethodTypeId: "CASH",
  },
  {
    display: "Cheque",
    paymentMethodTypeId: "CHEQUE",
  },
  {
    display: "Web - AMEX",
    paymentType: "AM",
    paymentMethodTypeId: "WEB",
  },
  {
    display: "Web - Mastercard",
    paymentType: "MC",
    paymentMethodTypeId: "WEB",
  },
  {
    display: "Web - Visa",
    paymentType: "VI",
    paymentMethodTypeId: "WEB",
  },
  {
    display: "Web - Visa (Debit)",
    paymentType: "PV",
    paymentMethodTypeId: "WEB",
  },
  {
    display: "Web - Mastercard (Debit)",
    paymentType: "MD",
    paymentMethodTypeId: "WEB",
  },
  {
    display: "IcePay - AMEX",
    paymentType: "AM",
    paymentMethodTypeId: "ICEPAY",
  },
  {
    display: "IcePay - Mastercard",
    paymentType: "MC",
    paymentMethodTypeId: "ICEPAY",
  },
  {
    display: "IcePay - Visa",
    paymentType: "VI",
    paymentMethodTypeId: "ICEPAY",
  },
  {
    display: "IcePay - Visa (Debit)",
    paymentType: "PV",
    paymentMethodTypeId: "ICEPAY",
  },
  {
    display: "IcePay - Mastercard (Debit)",
    paymentType: "MD",
    paymentMethodTypeId: "ICEPAY",
  },
  {
    display: "PoS - AMEX",
    paymentType: "AM",
    paymentMethodTypeId: "POS",
  },
  {
    display: "PoS - Mastercard",
    paymentType: "MC",
    paymentMethodTypeId: "POS",
  },
  {
    display: "PoS - Visa",
    paymentType: "VI",
    paymentMethodTypeId: "POS",
  },
  {
    display: "PoS - Visa (Debit)",
    paymentType: "PV",
    paymentMethodTypeId: "POS",
  },
  {
    display: "PoS - Mastercard (Debit)",
    paymentType: "MD",
    paymentMethodTypeId: "POS",
  },
];

export const consolidatedRecord: Record<string, PaymentMode> = {
  "Credit Account": {
    paymentMethodTypeId: "ACCOUNT",
  },
  "GA Payment": {
    paymentMethodTypeId: "GA",
  },
  Cash: {
    paymentMethodTypeId: "CASH",
  },
  Cheque: {
    paymentMethodTypeId: "CHEQUE",
  },
  "Web - AMEX": {
    paymentMethodTypeId: "WEB",
    paymentType: "AM",
  },
  "Web - Mastercard": {
    paymentMethodTypeId: "WEB",
    paymentType: "MC",
  },
  "Web - Visa": {
    paymentMethodTypeId: "WEB",
    paymentType: "VI",
  },
  "Web - Visa (Debit)": {
    paymentMethodTypeId: "WEB",
    paymentType: "PV",
  },
  "Web - Mastercard (Debit)": {
    paymentMethodTypeId: "WEB",
    paymentType: "MD",
  },
  "IcePay - AMEX": {
    paymentMethodTypeId: "ICEPAY",
    paymentType: "AM",
  },
  "IcePay - Mastercard": {
    paymentMethodTypeId: "ICEPAY",
    paymentType: "MC",
  },
  "IcePay - Visa": {
    paymentMethodTypeId: "ICEPAY",
    paymentType: "VI",
  },
  "IcePay - Visa (Debit)": {
    paymentMethodTypeId: "ICEPAY",
    paymentType: "PV",
  },
  "IcePay - Mastercard (Debit)": {
    paymentMethodTypeId: "ICEPAY",
    paymentType: "MD",
  },
  "PoS - AMEX": {
    paymentMethodTypeId: "POS",
    paymentType: "AM",
  },
  "PoS - Mastercard": {
    paymentMethodTypeId: "POS",
    paymentType: "MC",
  },
  "PoS - Visa": {
    paymentMethodTypeId: "POS",
    paymentType: "VI",
  },
  "PoS - Visa (Debit)": {
    paymentMethodTypeId: "POS",
    paymentType: "PV",
  },
  "PoS - Mastercard (Debit)": {
    paymentMethodTypeId: "POS",
    paymentType: "MD",
  },
};
