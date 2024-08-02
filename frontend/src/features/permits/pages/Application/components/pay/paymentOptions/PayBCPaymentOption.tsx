import { FormControlLabel, Radio } from "@mui/material";
import {
  PAYMENT_METHOD_TYPE_CODE,
  PaymentMethodTypeCode,
} from "../../../../../../../common/types/paymentMethods";
import "./PayBCPaymentOption.scss";

const paymentMethod = PAYMENT_METHOD_TYPE_CODE.WEB;

export const PayBCPaymentOption = ({
  isSelected,
  handlePaymentMethodChange,
}: {
  isSelected: boolean;
  handlePaymentMethodChange: (
    selectedPaymentMethod: PaymentMethodTypeCode,
  ) => void;
}) => {
  return (
    <div
      role="radio"
      onClick={() => handlePaymentMethodChange(paymentMethod)}
      onKeyDown={() => true}
      className={
        isSelected ? "payment-option payment-option--active" : "payment-option"
      }
    >
      <FormControlLabel
        className="label"
        componentsProps={{
          typography: {
            className: "label__container",
          },
        }}
        label={
          <div className="icon-display">
            <div className="icon-display__left">
              <span className="icon-display__title">Use</span>
              <img
                src="/PayBC-Main-Logo.png"
                alt="PayBC"
                className="icon-display__icon"
              />
            </div>
            <div className="icon-display__right">
              <img
                src="/Visa_Logo.svg"
                alt="Visa"
                className="icon-display__icon icon-display__icon--visa"
              />
              <img
                src="/Mastercard_Logo.svg"
                alt="Mastercard"
                className="icon-display__icon icon-display__icon--mc"
              />
              <img
                src="/Amex_Logo.svg"
                alt="Amex"
                className="icon-display__icon icon-display__icon--amex"
              />
            </div>
          </div>
        }
        value={PAYMENT_METHOD_TYPE_CODE.WEB}
        control={<Radio key="pay-by-paybc" />}
      />

      <div className="payment-option__msg">
        A convenient, secure and easy way to pay for BC Government Services
        online.
      </div>
    </div>
  );
};
