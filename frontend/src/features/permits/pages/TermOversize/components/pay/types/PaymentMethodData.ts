import { Nullable } from "../../../../../../../common/types/common";
import { PaymentCardTypeCode, PaymentMethodTypeCode } from "../../../../../../../common/types/paymentMethods";

export const DEFAULT_EMPTY_CARD_TYPE = "select";

export interface PaymentMethodData {
  paymentMethod: PaymentMethodTypeCode;
  cardType?: Nullable<PaymentCardTypeCode> | typeof DEFAULT_EMPTY_CARD_TYPE;
  transactionId?: string,
};
