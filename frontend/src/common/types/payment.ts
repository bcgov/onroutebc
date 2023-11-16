export type LinkedToCardsPaymentMethodTypeId = "WEB" | "ICEPAY" | "POS";
export type PaymentMethodTypeId =
  | LinkedToCardsPaymentMethodTypeId
  | "ACCOUNT"
  | "GA"
  | "CASH"
  | "CHEQUE" | "ALL";

export interface PaymentType {
  type: string;
  name: string;
  description?: string;
}

export interface PaymentMethodType {
  type: PaymentMethodTypeId;
  name: string;
  description?: string;
}

export const paymentTypes: PaymentType[] = [
  {
    type: "AM",
    name: "AMEX",
    description: "AMEX",
  },
  {
    type: "MC",
    name: "Mastercard",
    description: "Mastercard",
  },
  {
    type: "VI",
    name: "Visa",
    description: "Visa",
  },
  {
    type: "PV",
    name: "Visa (Debit)",
    description: "Visa (Debit)",
  },
  {
    type: "MD",
    name: "Mastercard (Debit)",
    description: "Mastercard (Debit)",
  },
];

export type PaymentMethodsAndIds = {
  display: string;
  paymentMethodTypeId: string;
  paymentType?: string;
};

export const getPaymentMethodAndTypes = () => {
  const paymentMethodAndTypes: PaymentMethodsAndIds[] = [];

  paymentMethodTypesWithoutPaymentTypeId.forEach(({ name, type }) => {
    paymentMethodAndTypes.push({
      display: name,
      paymentMethodTypeId: type,
    });
  });

  paymentMethodTypesWithPaymentTypeId.forEach((paymentMethodType) => {
    paymentTypes.forEach((paymentType) => {
      paymentMethodAndTypes.push({
        display: hyphenate(paymentMethodType.name, paymentType.name),
        paymentType: paymentType.type,
        paymentMethodTypeId: paymentMethodType.type,
      });
    });
  });
  return paymentMethodAndTypes;
};

export const paymentMethodTypesWithPaymentTypeId: PaymentMethodType[] = [
  {
    type: "WEB",
    name: "Web",
  },
  {
    type: "ICEPAY",
    name: "IcePay",
  },
  {
    type: "POS",
    name: "PoS",
  },
];

export const paymentMethodTypesWithoutPaymentTypeId: PaymentMethodType[] = [
  {
    type: "ALL",
    name: "All Payment Methods",
  },
  {
    type: "ACCOUNT",
    name: "Credit Account",
  },
  {
    type: "GA",
    name: "GA Payment",
  },
  {
    type: "CASH",
    name: "Cash",
  },
  {
    type: "CHEQUE",
    name: "Cheque",
  },
];

const hyphenate = (one: string, two: string) => one + " - " + two;
