import { MRT_Cell } from "material-react-table";
import { RefundFormData } from "../types/RefundFormData";
import { Controller, useFormContext } from "react-hook-form";
import { useEffect } from "react";
import { NumberInput } from "../../../../../common/components/form/subFormComponents/NumberInput";
import {
  invalidTranactionIdLength,
  requiredMessage,
} from "../../../../../common/helpers/validationMessages";
import { PAYMENT_METHOD_TYPE_CODE } from "../../../../../common/types/paymentMethods";

export const RefundTransactionIdInput = ({
  cell,
}: {
  cell: MRT_Cell<RefundFormData>;
}) => {
  const formMethods = useFormContext();
  const { setValue, watch, control, getValues, trigger } = formMethods;

  const refundData = watch("refundData");

  const rowIsSelected = cell.row.getIsSelected();
  const fieldIndex = cell.row.index;
  const fieldName = `refundData.${fieldIndex}.refundTransactionId` as const;
  const fieldValue = refundData[fieldIndex].refundTransactionId;

  // must use getValues to access fields outside of the one we are rendering in order to get latest values
  const refundAmount = getValues(`refundData.${fieldIndex}.refundAmount`);
  const chequeRefund = getValues(`refundData.${fieldIndex}.chequeRefund`);
  const paymentMethodTypeCode = getValues(
    `refundData.${fieldIndex}.paymentMethodTypeCode`,
  );
  const isCreditAccount =
    paymentMethodTypeCode === PAYMENT_METHOD_TYPE_CODE.ACCOUNT;
  // clear refundTransactionId when refundAmount is empty or zero
  useEffect(() => {
    if (!refundAmount || Number(refundAmount) <= 0) {
      setValue(fieldName, "");
    }
  }, [refundAmount, fieldIndex, setValue]);

  // re-validate refundTransactionId when chequeRefund is checked/unchecked
  useEffect(() => {
    trigger(fieldName);
  }, [chequeRefund, fieldIndex, trigger]);

  // clear refundTransactionId when row is unselected
  useEffect(() => {
    !rowIsSelected && setValue(fieldName, "");
  }, [rowIsSelected, setValue, fieldIndex]);

  return (
    <Controller
      name={fieldName}
      control={control}
      rules={{
        required: {
          value:
            refundAmount !== "" &&
            Number(refundAmount) !== 0 &&
            !chequeRefund &&
            !isCreditAccount,
          message: requiredMessage(),
        },
        maxLength: {
          value: 15,
          message: invalidTranactionIdLength(15),
        },
      }}
      render={({ fieldState: { error } }) => (
        <NumberInput
          classes={{
            root: "transaction-history-table__input-container",
          }}
          inputProps={{
            className: "transaction-history-table__input",
            value: fieldValue,
            onChange: ({ target: { value } }) => setValue(fieldName, value),
            disabled:
              !refundAmount ||
              Number(refundAmount) <= 0 ||
              chequeRefund ||
              isCreditAccount,
          }}
          helperText={
            error?.message
              ? {
                  errors: [error.message],
                }
              : undefined
          }
        />
      )}
    />
  );
};
