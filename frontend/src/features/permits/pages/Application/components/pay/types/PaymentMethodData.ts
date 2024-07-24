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
    InPersonPPCPaymentData | IcepayPaymentData | InPersonServiceBCOffice
  >;
}

export const IN_PERSON_PPC_PAYMENT_TYPES = {
  ...PAYMENT_CARD_TYPE_CODE,
  CASH: PAYMENT_METHOD_TYPE_CODE.CASH,
  CHEQUE: PAYMENT_METHOD_TYPE_CODE.CHEQUE,
} as const;

export type InPersonPPCPaymentType =
  (typeof IN_PERSON_PPC_PAYMENT_TYPES)[keyof typeof IN_PERSON_PPC_PAYMENT_TYPES];

export interface IcepayPaymentData {
  cardType?: Nullable<PaymentCardTypeCode> | typeof DEFAULT_EMPTY_CARD_TYPE;
  icepayTransactionId?: string;
}

export interface InPersonPPCPaymentData {
  paymentType:
    | Nullable<InPersonPPCPaymentType>
    | typeof DEFAULT_EMPTY_PAYMENT_TYPE;
  ppcTransactionId: string;
}

export interface InPersonServiceBCOffice {
  serviceBCOfficeId: string;
}
