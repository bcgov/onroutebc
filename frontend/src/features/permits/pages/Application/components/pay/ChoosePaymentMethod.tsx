import { Controller, useFormContext } from "react-hook-form";
import {
  Box,
  RadioGroup,
  Typography,
} from "@mui/material";

import "./ChoosePaymentMethod.scss";
import { PaymentOption } from "./PaymentOption";
import { PaymentMethodTypeCode } from "../../../../../../common/types/paymentMethods";

export const ChoosePaymentMethod = ({
  availablePaymentMethods,
}: {
  availablePaymentMethods: PaymentMethodTypeCode[];
}) => {
  const {
    control,
    watch,
    setValue,
    clearErrors,
  } = useFormContext();

  const handlePaymentMethodChange = (selectedPaymentMethod: string) => {
    setValue("paymentMethod", selectedPaymentMethod as PaymentMethodTypeCode);
    setValue("cardType", "");
    setValue("transactionId", "");
    clearErrors(["cardType", "transactionId"]);
  };

  const currPaymentMethod = watch("paymentMethod");
  
  return (
    <Box className="choose-payment-method">
      <Typography
        className="choose-payment-method__title"
        variant="h3"
      >
        Choose a Payment Method
      </Typography>

      <Controller
        control={control}
        name="paymentMethod"
        render={({ field: { value } }) => (
          <RadioGroup
            className="choose-payment-method__options"
            defaultValue={value}
            value={value}
            onChange={(e) => handlePaymentMethodChange(e.target.value)}
          >
            {availablePaymentMethods.map(paymentMethod => (
              <PaymentOption
                key={paymentMethod}
                paymentMethod={paymentMethod}
                isSelected={paymentMethod === currPaymentMethod}
              />
            ))}
          </RadioGroup>
        )}
      />
    </Box>
  );
};
