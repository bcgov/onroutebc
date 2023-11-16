export type PaymentMethodsAndIds = {
  display: string;
  paymentMethodTypeId:
    | "ACCOUNT"
    | "GA"
    | "CASH"
    | "CHEQUE"
    | "POS"
    | "WEB"
    | "ICEPAY";
  paymentType?: "AM" | "PV" | "MC" | "MD" | "VI";
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
