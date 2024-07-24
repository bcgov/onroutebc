import { IcepayPaymentOption } from "./paymentOptions/IcepayPaymentOption";
import { PayBCPaymentOption } from "./paymentOptions/PayBCPaymentOption";
import {
  PAYMENT_METHOD_TYPE_CODE,
  PaymentMethodTypeCode,
} from "../../../../../../common/types/paymentMethods";
import { PPCPaymentOption } from "./paymentOptions/PPCPaymentOption";

export const PaymentOption = ({
  paymentMethod,
  isSelected,
}: {
  paymentMethod: PaymentMethodTypeCode;
  isSelected: boolean;
}) => {
  switch (paymentMethod) {
    case PAYMENT_METHOD_TYPE_CODE.ICEPAY:
      return <IcepayPaymentOption isSelected={isSelected} />;
    case PAYMENT_METHOD_TYPE_CODE.WEB:
      return <PayBCPaymentOption isSelected={isSelected} />;
    case PAYMENT_METHOD_TYPE_CODE.PPC:
      return <PPCPaymentOption isSelected={isSelected} />;
    default:
      return null;
  }
};
