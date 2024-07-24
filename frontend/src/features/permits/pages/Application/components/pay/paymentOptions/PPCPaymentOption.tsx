/* eslint-disable @typescript-eslint/no-unused-vars */
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
  PAYMENT_CARD_TYPE_CODE,
  PAYMENT_CARD_TYPE_DISPLAY,
  PAYMENT_METHOD_TYPE_CODE,
  PAYMENT_METHOD_TYPE_DISPLAY,
} from "../../../../../../../common/types/paymentMethods";
import {
  DEFAULT_EMPTY_PAYMENT_TYPE,
  PaymentMethodData,
} from "../types/PaymentMethodData";
import "./PPCPaymentOption.scss";
import { Controller, useFormContext } from "react-hook-form";
import { Nullable } from "../../../../../../../common/types/common";
import { requiredMessage } from "../../../../../../../common/helpers/validationMessages";
import { getErrorMessage } from "../../../../../../../common/components/form/CustomFormComponents";

const paymentTypeOptions = [
  {
    label: "Select",
    value: DEFAULT_EMPTY_PAYMENT_TYPE,
  },
  {
    label: PAYMENT_CARD_TYPE_DISPLAY.AM,
    value: PAYMENT_CARD_TYPE_CODE.AM,
  },
  {
    label: PAYMENT_METHOD_TYPE_DISPLAY.CASH,
    value: PAYMENT_METHOD_TYPE_CODE.CASH,
  },
  {
    label: PAYMENT_METHOD_TYPE_DISPLAY.CHEQUE,
    value: PAYMENT_METHOD_TYPE_CODE.CHEQUE,
  },
  {
    label: PAYMENT_CARD_TYPE_DISPLAY.DB,
    value: PAYMENT_CARD_TYPE_CODE.DB,
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

const paymentTypeRules = {
  validate: {
    requiredWhenSelected: (
      value: Nullable<string>,
      formValues: PaymentMethodData,
    ) => {
      return (
        formValues.paymentMethod !== PAYMENT_METHOD_TYPE_CODE.PPC ||
        (value != null &&
          value.trim() !== "" &&
          value.trim() !== DEFAULT_EMPTY_PAYMENT_TYPE) ||
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
        formValues.paymentMethod !== PAYMENT_METHOD_TYPE_CODE.PPC ||
        (value != null && value.trim() !== "") ||
        requiredMessage()
      );
    },
  },
};

export const PPCPaymentOption = ({ isSelected }: { isSelected: boolean }) => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<PaymentMethodData>();

  return (
    <div
      className={`payment-option payment-option--ppc ${
        isSelected ? "payment-option--active" : ""
      }`}
    >
      <FormControlLabel
        className="payment-option__label"
        componentsProps={{
          typography: {
            className: "label-container",
          },
        }}
        label={
          <div className="label-text">
            {PAYMENT_METHOD_TYPE_DISPLAY[PAYMENT_METHOD_TYPE_CODE.PPC]}
          </div>
        }
        value={PAYMENT_METHOD_TYPE_CODE.PPC}
        control={<Radio key="pay-by-ppc" />}
      />
      <div className="payment-details">
        <Controller
          name="additionalPaymentData.paymentType"
          control={control}
          rules={paymentTypeRules}
          render={({ field: { value }, fieldState: { invalid } }) => (
            <FormControl
              className="payment-details__info payment-details__info--card"
              error={invalid}
            >
              <FormLabel className="payment-details__label">
                Payment Type
              </FormLabel>
              <Select
                className={`payment-details__input payment-details__input--card ${
                  invalid ? "payment-details__input--err" : ""
                }`}
                value={value}
                {...register(
                  "additionalPaymentData.paymentType",
                  paymentTypeRules,
                )}
              >
                {paymentTypeOptions.map((paymentTypeOption) => (
                  <MenuItem
                    key={paymentTypeOption.value}
                    value={paymentTypeOption.value}
                  >
                    {paymentTypeOption.label}
                  </MenuItem>
                ))}
              </Select>
              {invalid ? (
                <FormHelperText className="payment-details__err" error>
                  {getErrorMessage(errors, "additionalPaymentData.paymentType")}
                </FormHelperText>
              ) : null}
            </FormControl>
          )}
        />
        <Controller
          name="additionalPaymentData.ppcTransactionId"
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
                  "additionalPaymentData.ppcTransactionId",
                  transactionIdRules,
                )}
              />
              {invalid ? (
                <FormHelperText className="payment-details__err" error>
                  {getErrorMessage(
                    errors,
                    "additionalPaymentData.ppcTransactionId",
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
