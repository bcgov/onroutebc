import { IcepayPaymentOption } from "./paymentOptions/IcepayPaymentOption";
import { PayBCPaymentOption } from "./paymentOptions/PayBCPaymentOption";
import {
  PAYMENT_METHOD_TYPE_CODE,
  PaymentMethodTypeCode,
} from "../../../../../../common/types/paymentMethods";
import { InPersonPPCPaymentOption } from "./paymentOptions/InPersonPPCPaymentOption";
import { GAPaymentOption } from "./paymentOptions/GAPaymentOption";
import { CreditAccountPaymentOption } from "./paymentOptions/CreditAccountPaymentOption";

export const PaymentOption = ({
  paymentMethod,
  isSelected,
  handlePaymentMethodChange,
}: {
  paymentMethod: PaymentMethodTypeCode;
  isSelected: boolean;
  handlePaymentMethodChange: (
    selectedPaymentMethod: PaymentMethodTypeCode,
  ) => void;
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
        <InPersonPPCPaymentOption
          isSelected={isSelected}
          handlePaymentMethodChange={handlePaymentMethodChange}
        />
      );
    case PAYMENT_METHOD_TYPE_CODE.GA:
      return (
        <GAPaymentOption
          isSelected={isSelected}
          handlePaymentMethodChange={handlePaymentMethodChange}
        />
      );
    case PAYMENT_METHOD_TYPE_CODE.ACCOUNT:
      return (
        <CreditAccountPaymentOption
          isSelected={isSelected}
          handlePaymentMethodChange={handlePaymentMethodChange}
        />
      );
    default:
      return null;
  }
};
