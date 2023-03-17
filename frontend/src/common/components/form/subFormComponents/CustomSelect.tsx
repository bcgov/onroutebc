import { Select } from "@mui/material";
import {
  FieldValues,
  FieldPath,
  RegisterOptions,
  useFormContext,
} from "react-hook-form";
import { BC_COLOURS } from "../../../../themes/bcGovStyles";
import { ORBC_FormTypes } from "../../../../types/common";

/**
 * Properties of the onrouteBC customized Select MUI component
 */
interface CustomSelectProps<T extends FieldValues> {
  feature: string;
  name: FieldPath<T>;
  rules: RegisterOptions;
  menuOptions?: JSX.Element[];
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
      inputProps={{
        "aria-label": name,
      }}
      value={value ?? ""}
      {...register(name, rules)}
      MenuProps={{
        style: {
          // Fix for aligning the width of menu to the dropdown
          width: 100 % -10,
        },
      }}
      sx={{
        "&&.Mui-focused fieldset": {
          border: `2px solid ${BC_COLOURS.focus_blue}`,
        },
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
    >
      {menuOptions}
    </Select>
  );
};
