import { Controller, useFormContext } from "react-hook-form";
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  MenuItem,
  OutlinedInput,
  Radio,
  Select,
} from "@mui/material";

import "./IcepayPaymentOption.scss";
import { PaymentMethodData } from "../types/PaymentMethodData";
import { requiredMessage } from "../../../../../../../common/helpers/validationMessages";
import { Nullable } from "../../../../../../../common/types/common";
import { getErrorMessage } from "../../../../../../../common/components/form/CustomFormComponents";
import {
  PAYMENT_CARD_TYPE_CODE,
  PAYMENT_METHOD_TYPE_CODE,
  PAYMENT_CARD_TYPE_DISPLAY,
} from "../../../../../../../common/types/paymentMethods";

const cardTypeOptions = [
  {
    label: "Select",
    value: "",
  },
  {
    label: PAYMENT_CARD_TYPE_DISPLAY.AM,
    value: PAYMENT_CARD_TYPE_CODE.AM,
  },
  {
    label: PAYMENT_CARD_TYPE_DISPLAY.MC,
    value: PAYMENT_CARD_TYPE_CODE.MC,
  },
  {
    label: PAYMENT_CARD_TYPE_DISPLAY.MD,
    value: PAYMENT_CARD_TYPE_CODE.MD,
  },
  {
    label: PAYMENT_CARD_TYPE_DISPLAY.VI,
    value: PAYMENT_CARD_TYPE_CODE.VI,
  },
  {
    label: PAYMENT_CARD_TYPE_DISPLAY.PV,
    value: PAYMENT_CARD_TYPE_CODE.PV,
  },
];

const requiredRules = {
  validate: {
    requiredWhenSelected: (
      value: Nullable<string>,
      formValues: PaymentMethodData,
    ) => {
      return (
        (formValues.paymentMethod !== PAYMENT_METHOD_TYPE_CODE.ICEPAY) ||
        (value != null && value.trim() !== "") ||
        requiredMessage()
      );
    },
  },
};

export const IcepayPaymentOption = ({
  isSelected,
}: {
  isSelected: boolean;
}) => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<PaymentMethodData>();

  return (
    <div
      className={`payment-option payment-option--icepay ${
        isSelected
          ? "payment-option--active"
          : ""
      }`}
    >
      <FormControlLabel
        className="payment-option__label"
        label={
          <div className="label-icon-display">
            <div className="label-icon-display__left">
              <img
                src="/ICEPAY_Logo.svg"
                alt="IcePay"
                className="label-icon-display__icon"
              />
            </div>
            <div className="label-icon-display__right">
              <img
                src="/Visa_Logo.svg"
                alt="Visa"
                className="label-icon-display__icon"
              />
              <img
                src="/Mastercard_Logo.svg"
                alt="Mastercard"
                className="label-icon-display__icon"
              />
              <img
                src="/Amex_Logo.svg"
                alt="Amex"
                className="label-icon-display__icon"
              />
            </div>
          </div>
        }
        value={PAYMENT_METHOD_TYPE_CODE.ICEPAY}
        control={
          <Radio key="pay-by-icepay" />
        }
      />

      <div className="payment-details">
        <Controller
          name="cardType"
          control={control}
          rules={requiredRules}
          render={({
            field: { value },
            fieldState: { invalid },
          }) => (
            <FormControl className="payment-details__info payment-details__info--card">
              <FormLabel className="payment-details__label">
                Card Type
              </FormLabel>
              <Select
                className="payment-details__input payment-details__input--card"
                value={value}
                {...register(
                  "cardType",
                  requiredRules,
                )}
              >
                {cardTypeOptions.map((cardTypeOption) => (
                  <MenuItem
                    key={cardTypeOption.label}
                    value={cardTypeOption.value}
                  >
                    {cardTypeOption.label}
                  </MenuItem>
                ))}
              </Select>
              {invalid ? (
                <FormHelperText
                  className="payment-details__err"
                  error
                >
                  {getErrorMessage(errors, "cardType")}
                </FormHelperText>
              ) : null}
            </FormControl>
          )}
        />

        <Controller
          name="transactionId"
          control={control}
          rules={requiredRules}
          render={({
            field: { value },
            fieldState: { invalid },
          }) => (
            <FormControl
              className="payment-details__info payment-details__info--transaction"
              error={invalid}
            >
              <FormLabel className="payment-details__label">
                Transaction ID
              </FormLabel>
              <OutlinedInput
                className={`payment-details__input payment-details__input--transaction ${
                  invalid ? "payment-details__input--err" : ""
                }`}
                defaultValue={value}
                {...register(
                  "transactionId",
                  requiredRules,
                )}
              />
              {invalid ? (
                <FormHelperText
                  className="payment-details__err"
                  error
                >
                  {getErrorMessage(errors, "transactionId")}
                </FormHelperText>
              ) : null}
            </FormControl>
          )}
        />
      </div>
    </div>
  );
};
