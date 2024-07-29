import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  OutlinedInput,
  Radio,
} from "@mui/material";
import { PAYMENT_METHOD_TYPE_CODE } from "../../../../../../../common/types/paymentMethods";
import { PaymentMethodData } from "../types/PaymentMethodData";
import "./ServiceBCPaymentOption.scss";
import { Controller, useFormContext } from "react-hook-form";
import { Nullable } from "../../../../../../../common/types/common";
import { requiredMessage } from "../../../../../../../common/helpers/validationMessages";
import { getErrorMessage } from "../../../../../../../common/components/form/CustomFormComponents";

const paymentMethod = PAYMENT_METHOD_TYPE_CODE.GA;

const serviceBCOfficeIDRules = {
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
};

export const ServiceBCPaymentOption = ({
  isSelected,
  handlePaymentMethodChange,
}: {
  isSelected: boolean;
  handlePaymentMethodChange: (selectedPaymentMethod: string) => void;
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
      className={`payment-option payment-option--service-bc ${
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
            In-person at a Service BC Office (GA)
          </div>
        }
        value={paymentMethod}
        control={<Radio key="pay-by-service-bc" />}
      />
      <div className="payment-details">
        <Controller
          name="additionalPaymentData.serviceBCOfficeId"
          control={control}
          rules={serviceBCOfficeIDRules}
          render={({ field: { value }, fieldState: { invalid } }) => (
            <FormControl className="payment-details__info" error={invalid}>
              <FormLabel className="payment-details__label">
                Service BC Office ID Number
              </FormLabel>
              <OutlinedInput
                className={`payment-details__input payment-details__input ${
                  invalid ? "payment-details__input--err" : ""
                }`}
                defaultValue={value}
                {...register(
                  "additionalPaymentData.serviceBCOfficeId",
                  serviceBCOfficeIDRules,
                )}
                onChange={() => handlePaymentMethodChange(paymentMethod)}
              />
              {invalid ? (
                <FormHelperText className="payment-details__err" error>
                  {getErrorMessage(
                    errors,
                    "additionalPaymentData.serviceBCOfficeId",
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
