import { Controller } from "react-hook-form";

import { NumberInput } from "../../../../../../../../common/components/form/subFormComponents/NumberInput";
import { getDefaultRequiredVal } from "../../../../../../../../common/helpers/util";
import { convertToNumberIfValid } from "../../../../../../../../common/helpers/numeric/convertToNumberIfValid";
import {
  Nullable,
  RequiredOrNull,
} from "../../../../../../../../common/types/common";

import {
  mustBeGreaterThanOrEqualTo,
  mustBeLessThanOrEqualTo,
  requiredMessage,
} from "../../../../../../../../common/helpers/validationMessages";

export const VehicleWeightInput = ({
  name,
  label,
  className,
  isEnabled,
  value,
  onUpdateValue,
}: {
  name: string;
  label: {
    id: string;
    component: React.ReactNode;
  };
  className: string;
  isEnabled: boolean;
  value?: Nullable<number>;
  onUpdateValue: (updateValue: RequiredOrNull<number>) => void;
}) => {
  const validationRules = {
    required: isEnabled ? { value: true, message: requiredMessage() } : false,
    min: { value: 0, message: mustBeGreaterThanOrEqualTo(0) },
    max: { value: 63500, message: mustBeLessThanOrEqualTo(63500) },
  };

  return (
    <Controller
      name={name}
      rules={validationRules}
      render={({ fieldState: { error } }) => (
        <NumberInput
          label={label}
          classes={{
            root: className,
          }}
          inputProps={{
            value: getDefaultRequiredVal(null, value),
            maskFn: (numericVal) => numericVal.toFixed(0),
            onBlur: (e) => {
              onUpdateValue(
                getDefaultRequiredVal(
                  null,
                  convertToNumberIfValid(e.target.value, null),
                ),
              );
            },
            slotProps: {
              input: {
                min: 0,
                step: 1,
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
