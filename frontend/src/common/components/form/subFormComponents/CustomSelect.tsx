import { Select } from "@mui/material";
import {
  FieldValues,
  FieldPath,
  RegisterOptions,
  useFormContext,
} from "react-hook-form";

import "./CustomSelect.scss";
import { ORBC_FormTypes } from "../../../types/common";
import { CustomSelectDisplayProps } from "../../../types/formElements";

/**
 * Properties of the onrouteBC customized Select MUI component
 */
interface CustomSelectProps<T extends FieldValues> {
  feature: string;
  name: FieldPath<T>;
  rules: RegisterOptions;
  menuOptions?: JSX.Element[];
  disabled?: boolean;
  readOnly?: boolean;
}

/**
 * An onRouteBC customized MUI Select component
 * Based on https://mui.com/material-ui/react-select/
 */
export const CustomSelect = <T extends ORBC_FormTypes>({
  feature,
  name,
  rules,
  menuOptions,
  disabled,
  readOnly,
}: CustomSelectProps<T>): JSX.Element => {
  const {
    register,
    trigger,
    watch,
    formState: { isSubmitted },
  } = useFormContext();
  const value = watch(name);

  return (
    <Select
      aria-labelledby={`${feature}-${name}-label`}
      className={`custom-select ${disabled ? "custom-select--disabled" : ""}`}
      disabled={disabled}
      readOnly={readOnly}
      inputProps={{
        "aria-label": name,
      }}
      value={value ?? ""}
      {...register(name, rules)}
      MenuProps={{
        className: "custom-select__menu"
      }}
      // This onClose function fixes a bug where the Select component does not immediately
      // revalidate when selecting an option after an invalid form submission.
      // The validation needed to be triggered again manually
      onClose={async () => {
        if (isSubmitted) {
          const output = await trigger(name);
          if (!output) {
            trigger(name);
          }
        }
      }}
      SelectDisplayProps={
        {
          "data-testid": `select-${name}`,
          className: "custom-select__input-container",
        } as CustomSelectDisplayProps
      }
    >
      {menuOptions}
    </Select>
  );
};
