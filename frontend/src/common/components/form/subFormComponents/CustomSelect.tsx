import { Select } from "@mui/material";
import {
  FieldValues,
  FieldPath,
  RegisterOptions,
  useFormContext,
} from "react-hook-form";
import { ORBC_FormTypes } from "../../../../types/common";
import { SELECT_FIELD_STYLE } from "../../../../themes/orbcStyles";

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
        "data-testid": `select-${name}`,
      }}
      value={value ?? ""}
      {...register(name, rules)}
      MenuProps={SELECT_FIELD_STYLE.MENU_PROPS}
      sx={SELECT_FIELD_STYLE.SELECT_FIELDSET}
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
