import { Controller, useFormContext } from "react-hook-form";
import { Box, RadioGroup, Typography } from "@mui/material";

import "./ChoosePaymentMethod.scss";
import { PaymentOption } from "./PaymentOption";
import { PaymentMethodTypeCode } from "../../../../../../common/types/paymentMethods";
import {
  DEFAULT_EMPTY_CARD_TYPE,
  DEFAULT_EMPTY_PAYMENT_TYPE,
} from "./types/PaymentMethodData";

export const ChoosePaymentMethod = ({
  availablePaymentMethods,
}: {
  availablePaymentMethods: PaymentMethodTypeCode[];
}) => {
  const { control, watch, setValue, clearErrors } = useFormContext();

  const handlePaymentMethodChange = (selectedPaymentMethod: string) => {
    setValue("paymentMethod", selectedPaymentMethod as PaymentMethodTypeCode);
    setValue("additionalPaymentData.cardType", DEFAULT_EMPTY_CARD_TYPE);
    setValue("additionalPaymentData.icepayTransactionId", "");
    setValue("additionalPaymentData.paymentType", DEFAULT_EMPTY_PAYMENT_TYPE);
    setValue("additionalPaymentData.ppcTransactionId", "");
    clearErrors([
      "additionalPaymentData.cardType",
      "additionalPaymentData.icepayTransactionId",
      "additionalPaymentData.paymentType",
      "additionalPaymentData.ppcTransactionId",
    ]);
  };

  const currPaymentMethod = watch("paymentMethod");

  return (
    <Box className="choose-payment-method">
      <Typography className="choose-payment-method__title" variant="h3">
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
            {availablePaymentMethods.map((paymentMethod) => (
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
