import { Select } from "@mui/material";
import {
  FieldValues,
  FieldPath,
  RegisterOptions,
  useFormContext,
} from "react-hook-form";
import { CompanyProfile } from "../../../../features/manageProfile/apiManager/manageProfileAPI";
import { CreatePowerUnit } from "../../../../features/manageVehicles/types/managevehicles";
import { BC_COLOURS } from "../../../../themes/bcGovStyles";

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
export const CustomSelect = <T extends CompanyProfile | CreatePowerUnit>({
  feature,
  name,
  rules,
  menuOptions,
}: CustomSelectProps<T>): JSX.Element => {
  const { register } = useFormContext();

  return (
    <Select
      aria-labelledby={`${feature}-${name}-label`}
      inputProps={{
        "aria-label": name,
      }}
      defaultValue={""}
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
    >
      {menuOptions}
    </Select>
  );
};
