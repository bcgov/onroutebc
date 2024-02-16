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
import { DEFAULT_EMPTY_CARD_TYPE, PaymentMethodData } from "../types/PaymentMethodData";
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
    value: DEFAULT_EMPTY_CARD_TYPE,
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

const cardTypeRules = {
  validate: {
    requiredWhenSelected: (
      value: Nullable<string>,
      formValues: PaymentMethodData,
    ) => {
      return (
        (formValues.paymentMethod !== PAYMENT_METHOD_TYPE_CODE.ICEPAY) ||
        (value != null && value.trim() !== "" && value.trim() !== DEFAULT_EMPTY_CARD_TYPE) ||
        requiredMessage()
      );
    },
  },
};

const transactionIdRules = {
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
        componentsProps={{
          typography: {
            className: "label-container"
          }
        }}
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
        value={PAYMENT_METHOD_TYPE_CODE.ICEPAY}
        control={
          <Radio key="pay-by-icepay" />
        }
      />

      <div className="payment-details">
        <Controller
          name="cardType"
          control={control}
          rules={cardTypeRules}
          render={({
            field: { value },
            fieldState: { invalid },
          }) => (
            <FormControl
              className="payment-details__info payment-details__info--card"
              error={invalid}
            >
              <FormLabel className="payment-details__label">
                Card Type
              </FormLabel>
              <Select
                className={`payment-details__input payment-details__input--card ${
                  invalid ? "payment-details__input--err" : ""
                }`}
                value={value}
                {...register(
                  "cardType",
                  cardTypeRules,
                )}
              >
                {cardTypeOptions.map((cardTypeOption) => (
                  <MenuItem
                    key={cardTypeOption.value}
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
          rules={transactionIdRules}
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
                  transactionIdRules,
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
