import { FormControlLabel, Radio } from "@mui/material";

import "./PayBCPaymentOption.scss";
import { PAYMENT_METHOD_TYPE_CODE } from "../../../../../../../common/types/paymentMethods";

export const PayBCPaymentOption = ({
  isSelected,
}: {
  isSelected: boolean;
}) => {
  return (
    <div
      className={`payment-option payment-option--paybc ${
        isSelected
          ? "payment-option--active"
          : ""
      }`}
    >
      <FormControlLabel
        className="payment-option__label"
        componentsProps={{
          typography: {
            className: "label-container"
          }
        }}
        label={
          <div className="label-icon-display">
            <div className="label-icon-display__left">
              <span className="label-icon-display__title">
                Use
              </span>
              <img
                src="/PayBC-Main-Logo.png"
                alt="PayBC"
                className="label-icon-display__icon"
              />
            </div>
            <div className="label-icon-display__right">
              <img
                src="/Visa_Logo.svg"
                alt="Visa"
                className="label-icon-display__icon label-icon-display__icon--visa"
              />
              <img
                src="/Mastercard_Logo.svg"
                alt="Mastercard"
                className="label-icon-display__icon label-icon-display__icon--mc"
              />
              <img
                src="/Amex_Logo.svg"
                alt="Amex"
                className="label-icon-display__icon label-icon-display__icon--amex"
              />
            </div>
          </div>
        }
        value={PAYMENT_METHOD_TYPE_CODE.WEB}
        control={
          <Radio key="pay-by-paybc" />
        }
      />

      <div className="payment-option__msg">
        A convenient, secure and easy way to pay for BC Government Services online.
      </div>
    </div>
  );
};
