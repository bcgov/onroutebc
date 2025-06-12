import { MRT_Cell } from "material-react-table";
import { RefundFormData } from "../types/RefundFormData";
import { Controller, useFormContext } from "react-hook-form";
import { useEffect } from "react";
import { NumberInput } from "../../../../../common/components/form/subFormComponents/NumberInput";

export const RefundAmountInput = ({
  cell,
}: {
  cell: MRT_Cell<RefundFormData>;
}) => {
  const formMethods = useFormContext();
  const { setValue, watch, control } = formMethods;

  const refundData = watch("refundData");

  const rowIsSelected = cell.row.getIsSelected();
  const fieldIndex = cell.row.index;
  const fieldName = `refundData.${fieldIndex}.refundAmount` as const;
  const fieldValue = refundData[fieldIndex].refundAmount;

  // clear refundAmount when row is unselected
  useEffect(() => {
    !rowIsSelected && setValue(fieldName, "");
  }, [rowIsSelected, setValue, fieldIndex]);

  return (
    <Controller
      name={fieldName}
      control={control}
      rules={{
        required: false,
      }}
      render={({ fieldState: { error } }) => (
        <NumberInput
          classes={{
            root: "transaction-history-table__input-container",
          }}
          inputProps={{
            className:
              "transaction-history-table__input transaction-history-table__input--refundAmount",
            value: fieldValue,
            onChange: ({ target: { value } }) => {
              setValue(fieldName, value);
            },
            disabled: !rowIsSelected,
            startAdornment: <span>$&nbsp;</span>,
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
