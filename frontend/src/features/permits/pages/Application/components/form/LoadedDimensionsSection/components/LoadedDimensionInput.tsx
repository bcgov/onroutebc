import { useCallback } from "react";
import { Controller } from "react-hook-form";

import { NumberInput } from "../../../../../../../../common/components/form/subFormComponents/NumberInput";
import { getDefaultRequiredVal } from "../../../../../../../../common/helpers/util";
import { convertToNumberIfValid } from "../../../../../../../../common/helpers/numeric/convertToNumberIfValid";
import {
  isNull,
  Nullable,
  RequiredOrNull,
} from "../../../../../../../../common/types/common";

import {
  mustBeGreaterThan,
  requiredMessage,
} from "../../../../../../../../common/helpers/validationMessages";

export const LoadedDimensionInput = ({
  name,
  label,
  className,
  value,
  onUpdateValue,
  minValue,
  canIncludeMinValue = false,
  shouldDefaultToMinValue = false,
  validationMsgValueDecimalPlaces,
}: {
  name: string;
  label: {
    id: string;
    component: React.ReactNode;
  };
  className: string;
  value?: Nullable<number>;
  onUpdateValue: (updateValue: RequiredOrNull<number>) => void;
  minValue: number;
  canIncludeMinValue?: boolean;
  shouldDefaultToMinValue?: boolean;
  validationMsgValueDecimalPlaces?: number;
}) => {
  const handleMask = (numericVal: number) => shouldDefaultToMinValue
    ? Math.max(minValue, numericVal).toFixed(2)
    : numericVal.toFixed(2);
    
  const handleBlur = useCallback(
    (numericVal: string) => {
      const convertedNullableNumber = getDefaultRequiredVal(
        null,
        convertToNumberIfValid(numericVal, null),
      );

      if (isNull(convertedNullableNumber) || !shouldDefaultToMinValue) {
        onUpdateValue(convertedNullableNumber);
      } else {
        onUpdateValue(Math.max(minValue, convertedNullableNumber));
      }
    },
    [onUpdateValue, shouldDefaultToMinValue, minValue, canIncludeMinValue],
  );

  return (
    <Controller
      name={name}
      rules={{
        required: { value: true, message: requiredMessage() },
        validate: {
          greaterThan: (v) =>
            (canIncludeMinValue ? Number(v) >= minValue : Number(v) > minValue) ||
            mustBeGreaterThan(minValue, validationMsgValueDecimalPlaces, "m"),
        },
      }}
      render={({ fieldState: { error } }) => (
        <NumberInput
          label={label}
          classes={{
            root: className,
          }}
          inputProps={{
            value: getDefaultRequiredVal(null, value),
            maskFn: handleMask,
            onBlur: (e) => {
              handleBlur(e.target.value);
            },
            slotProps: {
              input: {
                min: 0,
                step: 0.01,
              },
            },
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
