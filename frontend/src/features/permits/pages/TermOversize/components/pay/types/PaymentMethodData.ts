import { Nullable } from "../../../../../../../common/types/common";
import { PaymentCardTypeCode, PaymentMethodTypeCode } from "../../../../../../../common/types/paymentMethods";

export interface PaymentMethodData {
  paymentMethod: PaymentMethodTypeCode;
  cardType?: Nullable<PaymentCardTypeCode> | "";
  transactionId?: string,
};
