import { Nullable } from "../../../../../../../common/types/common";
import {
  PaymentCardTypeCode,
  PaymentMethodTypeCode,
  PAYMENT_CARD_TYPE_CODE,
  PAYMENT_METHOD_TYPE_CODE,
} from "../../../../../../../common/types/paymentMethods";

export const DEFAULT_EMPTY_CARD_TYPE = "select";
export const DEFAULT_EMPTY_PAYMENT_TYPE = "select";

export interface PaymentMethodData {
  paymentMethod: PaymentMethodTypeCode;
  additionalPaymentData?: Nullable<
    PPCPaymentData | IcepayPaymentData | ServiceBCPaymentData
  >;
}

export const PPC_PAYMENT_TYPES = {
  ...PAYMENT_CARD_TYPE_CODE,
  CASH: PAYMENT_METHOD_TYPE_CODE.CASH,
  CHEQUE: PAYMENT_METHOD_TYPE_CODE.CHEQUE,
} as const;

export type PPCPaymentType =
  (typeof PPC_PAYMENT_TYPES)[keyof typeof PPC_PAYMENT_TYPES];

export interface IcepayPaymentData {
  cardType?: Nullable<PaymentCardTypeCode> | typeof DEFAULT_EMPTY_CARD_TYPE;
  icepayTransactionId?: string;
}

export interface PPCPaymentData {
  paymentType: Nullable<PPCPaymentType> | typeof DEFAULT_EMPTY_PAYMENT_TYPE;
  ppcTransactionId: string;
}

export interface ServiceBCPaymentData {
  serviceBCOfficeId: string;
}

export const isCashOrCheque = (
  paymentType: Nullable<PPCPaymentType> | typeof DEFAULT_EMPTY_PAYMENT_TYPE,
) => {
  if (
    paymentType === PAYMENT_METHOD_TYPE_CODE.CASH ||
    paymentType === PAYMENT_METHOD_TYPE_CODE.CHEQUE
  ) {
    return true;
  } else {
    return false;
  }
};

export const getPPCPaymentMethodTypeCode = (paymentType: PPCPaymentType) => {
  let paymentMethod;
  switch (paymentType) {
    case PAYMENT_METHOD_TYPE_CODE.CASH:
      paymentMethod = PAYMENT_METHOD_TYPE_CODE.CASH;
      break;
    case PAYMENT_METHOD_TYPE_CODE.CHEQUE:
      paymentMethod = PAYMENT_METHOD_TYPE_CODE.CHEQUE;
      break;
    default:
      paymentMethod = PAYMENT_METHOD_TYPE_CODE.POS;
      break;
  }
  return paymentMethod;
};
