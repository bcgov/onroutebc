import { useContext } from "react";
import { Controller } from "react-hook-form";

import { NumberInput } from "../../../../../../../../common/components/form/subFormComponents/NumberInput";
import { getDefaultRequiredVal } from "../../../../../../../../common/helpers/util";
import { convertToNumberIfValid } from "../../../../../../../../common/helpers/numeric/convertToNumberIfValid";
import { Nullable } from "../../../../../../../../common/types/common";
import { ApplicationFormContext } from "../../../../../../context/ApplicationFormContext";
import {
  mustBeGreaterThanOrEqualTo,
  requiredMessage,
} from "../../../../../../../../common/helpers/validationMessages";

export const VehicleWeightInput = ({
  name,
  label,
  className,
  isEnabled,
  shouldValidateWhenEmpty,
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
  shouldValidateWhenEmpty: boolean;
  value?: Nullable<number>;
  onUpdateValue: (updateValue: Nullable<number>) => void;
}) => {
  // Display any violation messages thrown by policy engine
  const { policyViolations, clearViolation } = useContext(ApplicationFormContext);
  const policyViolationMsg = (name in policyViolations) ? policyViolations[name] : null;

  const validationRules = {
    required: (isEnabled || shouldValidateWhenEmpty) ? {
      value: true,
      message: requiredMessage(),
    } : false,
    min: { value: 0, message: mustBeGreaterThanOrEqualTo(0) },
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
              clearViolation(name);
            },
            slotProps: {
              input: {
                min: 0,
                step: 1,
              },
            },
            disabled: !isEnabled,
            readOnly: !isEnabled,
          }}
          helperText={
            error?.message
              ? {
                  errors: [error.message],
                }
              : (
                policyViolationMsg
                  ? {
                    errors: [policyViolationMsg],
                  } : undefined
              )
          }
        />
      )}
    />
  );
};
