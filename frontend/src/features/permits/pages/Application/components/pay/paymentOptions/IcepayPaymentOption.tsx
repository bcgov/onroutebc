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
import {
  DEFAULT_EMPTY_CARD_TYPE,
  PaymentMethodData,
} from "../types/PaymentMethodData";
import {
  invalidTranactionIdLength,
  requiredMessage,
} from "../../../../../../../common/helpers/validationMessages";
import { Nullable } from "../../../../../../../common/types/common";
import { getErrorMessage } from "../../../../../../../common/components/form/CustomFormComponents";
import {
  PAYMENT_CARD_TYPE_CODE,
  PAYMENT_METHOD_TYPE_CODE,
  PAYMENT_CARD_TYPE_DISPLAY,
  PaymentMethodTypeCode,
} from "../../../../../../../common/types/paymentMethods";
import "./IcepayPaymentOption.scss";

const paymentMethod = PAYMENT_METHOD_TYPE_CODE.ICEPAY;

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
        formValues.paymentMethod !== paymentMethod ||
        (value != null &&
          value.trim() !== "" &&
          value.trim() !== DEFAULT_EMPTY_CARD_TYPE) ||
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
        formValues.paymentMethod !== paymentMethod ||
        (value != null && value.trim() !== "") ||
        requiredMessage()
      );
    },
  },
  maxLength: {
    value: 15,
    message: invalidTranactionIdLength(15),
  },
};

export const IcepayPaymentOption = ({
  isSelected,
  handlePaymentMethodChange,
}: {
  isSelected: boolean;
  handlePaymentMethodChange: (
    selectedPaymentMethod: PaymentMethodTypeCode,
  ) => void;
}) => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<PaymentMethodData>();

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
              <img
                src="/ICEPAY_Logo.svg"
                alt="IcePay"
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
        value={paymentMethod}
        control={<Radio key="pay-by-icepay" />}
      />

      <div className="payment-details">
        <Controller
          name="additionalPaymentData.cardType"
          control={control}
          rules={cardTypeRules}
          render={({ field: { value }, fieldState: { invalid } }) => (
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
                {...register("additionalPaymentData.cardType", cardTypeRules)}
                onOpen={() => handlePaymentMethodChange(paymentMethod)}
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
                <FormHelperText className="payment-details__err" error>
                  {getErrorMessage(errors, "additionalPaymentData.cardType")}
                </FormHelperText>
              ) : null}
            </FormControl>
          )}
        />

        <Controller
          name="additionalPaymentData.icepayTransactionId"
          control={control}
          rules={transactionIdRules}
          render={({ field: { value }, fieldState: { invalid } }) => (
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
                  "additionalPaymentData.icepayTransactionId",
                  transactionIdRules,
                )}
                onChange={() => handlePaymentMethodChange(paymentMethod)}
              />
              {invalid ? (
                <FormHelperText className="payment-details__err" error>
                  {getErrorMessage(
                    errors,
                    "additionalPaymentData.icepayTransactionId",
                  )}
                </FormHelperText>
              ) : null}
            </FormControl>
          )}
        />
      </div>
    </div>
  );
};
