import { IcepayPaymentOption } from "./paymentOptions/IcepayPaymentOption";
import { PayBCPaymentOption } from "./paymentOptions/PayBCPaymentOption";
import {
  PAYMENT_METHOD_TYPE_CODE,
  PaymentMethodTypeCode,
} from "../../../../../../common/types/paymentMethods";
import { PPCPaymentOption } from "./paymentOptions/PPCPaymentOption";
import { ServiceBCPaymentOption } from "./paymentOptions/ServiceBCPaymentOption";

export const PaymentOption = ({
  paymentMethod,
  isSelected,
  handlePaymentMethodChange,
}: {
  paymentMethod: PaymentMethodTypeCode;
  isSelected: boolean;
  handlePaymentMethodChange: (selectedPaymentMethod: string) => void;
}) => {
  switch (paymentMethod) {
    case PAYMENT_METHOD_TYPE_CODE.ICEPAY:
      return (
        <IcepayPaymentOption
          isSelected={isSelected}
          handlePaymentMethodChange={handlePaymentMethodChange}
        />
      );
    case PAYMENT_METHOD_TYPE_CODE.WEB:
      return (
        <PayBCPaymentOption
          isSelected={isSelected}
          handlePaymentMethodChange={handlePaymentMethodChange}
        />
      );
    case PAYMENT_METHOD_TYPE_CODE.POS:
      return (
        <PPCPaymentOption
          isSelected={isSelected}
          handlePaymentMethodChange={handlePaymentMethodChange}
        />
      );
    case PAYMENT_METHOD_TYPE_CODE.GA:
      return (
        <ServiceBCPaymentOption
          isSelected={isSelected}
          handlePaymentMethodChange={handlePaymentMethodChange}
        />
      );
    default:
      return null;
  }
};
