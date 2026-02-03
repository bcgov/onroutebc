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
  PaymentMethodTypeCode,
} from "../../../../../../../common/types/paymentMethods";
import {
  DEFAULT_EMPTY_PAYMENT_TYPE,
  isCashOrCheque,
  PaymentMethodData,
} from "../types/PaymentMethodData";
import { Controller, useFormContext } from "react-hook-form";
import { Nullable } from "../../../../../../../common/types/common";
import {
  invalidTranactionIdLength,
  requiredMessage,
} from "../../../../../../../common/helpers/validationMessages";
import { getErrorMessage } from "../../../../../../../common/components/form/CustomFormComponents";
import "./InPersonPPCPaymentOption.scss";

const paymentMethod = PAYMENT_METHOD_TYPE_CODE.POS;

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

export const InPersonPPCPaymentOption = ({
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
    watch,
    formState: { errors },
    clearErrors,
  } = useFormContext<PaymentMethodData>();

  const paymentType = watch("additionalPaymentData.paymentType");

  const disableTransactionIdInput = isCashOrCheque(paymentType);

  const paymentTypeRules = {
    validate: {
      requiredWhenSelected: (
        value: Nullable<string>,
        formValues: PaymentMethodData,
      ) => {
        return (
          formValues.paymentMethod !== paymentMethod ||
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
        if (isCashOrCheque(paymentType)) {
          return true;
        }
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

  const paymentTypeRegister = register("additionalPaymentData.paymentType", {
    ...paymentTypeRules,
  });

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
          <div className="label__text">
            In-person at a Provincial Permit Centre
          </div>
        }
        value={paymentMethod}
        control={<Radio key="pay-by-ppc" />}
      />
      <div className="payment-details">
        <Controller
          name="additionalPaymentData.paymentType"
          control={control}
          rules={paymentTypeRules}
          render={({ field: { value, onChange }, fieldState: { invalid } }) => (
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
                {...paymentTypeRegister}
                value={value}
                onChange={(e) => {
                  clearErrors("additionalPaymentData.ppcTransactionId");
                  onChange(e);
                }}
                onOpen={() => handlePaymentMethodChange(paymentMethod)}
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
              className="payment-details__info payment-details__info"
              error={invalid}
            >
              <FormLabel
                className={`payment-details__label ${disableTransactionIdInput ? "payment-details__label--disabled" : ""}`}
              >
                Transaction ID
              </FormLabel>
              <OutlinedInput
                className={`payment-details__input payment-details__input ${
                  invalid
                    ? "payment-details__input--err"
                    : disableTransactionIdInput
                      ? "payment-details__input--disabled"
                      : ""
                }`}
                defaultValue={value}
                {...register(
                  "additionalPaymentData.ppcTransactionId",
                  transactionIdRules,
                )}
                onChange={() => handlePaymentMethodChange(paymentMethod)}
                disabled={disableTransactionIdInput}
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
