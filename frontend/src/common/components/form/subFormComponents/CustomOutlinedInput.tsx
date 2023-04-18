import { OutlinedInput } from "@mui/material";
import {
  FieldValues,
  FieldPath,
  RegisterOptions,
  useFormContext,
} from "react-hook-form";
import { BC_COLOURS } from "../../../../themes/bcGovStyles";
import { ORBC_FormTypes } from "../../../types/common";

/**
 * Properties of the onrouteBC customized OutlineInput MUI component
 */
export interface CustomOutlinedInputProps<T extends FieldValues> {
  feature: string;
  name: FieldPath<T>;
  rules: RegisterOptions;
  inputProps: RegisterOptions;
  invalid: boolean;
}

/**
 * An onRouteBC customized MUI OutlineInput component
 * Based on https://mui.com/material-ui/api/outlined-input/
 *
 */
export const CustomOutlinedInput = <T extends ORBC_FormTypes>(
  props: CustomOutlinedInputProps<T>
): JSX.Element => {
  const { register } = useFormContext();

  // Add aria-label to input prop for Jest testing purposes
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const updatedInputProps: any = props.inputProps;
  updatedInputProps["aria-label"] = props.name;

  return (
    <OutlinedInput
      inputProps={updatedInputProps}
      sx={{
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: props.invalid
            ? BC_COLOURS.bc_red
            : BC_COLOURS.focus_blue,
        },
      }}
      {...register(props.name, props.rules)}
    />
  );
};
