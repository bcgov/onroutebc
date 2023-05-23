import { OutlinedInput } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { BC_COLOURS } from "../../../../themes/bcGovStyles";
import { ORBC_FormTypes } from "../../../types/common";
import { CustomOutlinedInputProps } from "./CustomOutlinedInput";

/**
 * An onRouteBC customized MUI OutlineInput component
 * that automatically changes the format of the phone number as the user types
 */
export const PhoneNumberInput = <T extends ORBC_FormTypes>(
  props: CustomOutlinedInputProps<T>
): JSX.Element => {
  const { register, setValue } = useFormContext();

  // Everytime the user types, update the format of the users input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    setValue<string>(props.name, formattedValue, { shouldValidate: true });
  };

  return (
    <OutlinedInput
      aria-labelledby={`${props.feature}-${props.name}-label`}
      inputProps={props.inputProps}
      sx={{
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: props.invalid
            ? BC_COLOURS.bc_red
            : BC_COLOURS.focus_blue,
        },
      }}
      {...register(props.name, props.rules)}
      onChange={handleChange}
      autoComplete="tel"
    />
  );
};

/**
 * Function to format the users input to be in the correct phone number format
 * as the user types
 */
export const formatPhoneNumber = (input?: string): string => {
  if (!input) return "";
  // only allows 0-9 inputs
  const currentValue = input.replace(/[^\d]/g, "");
  const cvLength = currentValue.length;

  // Ignore formatting if the value length is greater than a standard Canada/US phone number
  // (11 digits incl. country code)
  if (cvLength > 11) {
    return currentValue;
  }
  // returns: "x ",
  if (cvLength < 1) return currentValue;

  // returns: "x", "xx", "xxx"
  if (cvLength < 4) return `${currentValue.slice(0, 3)}`;

  // returns: "(xxx)", "(xxx) x", "(xxx) xx", "(xxx) xxx",
  if (cvLength < 7)
    return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3)}`;

  // returns: "(xxx) xxx-", "(xxx) xxx-x", "(xxx) xxx-xx", "(xxx) xxx-xxx", "(xxx) xxx-xxxx"
  if (cvLength < 11)
    return `(${currentValue.slice(0, 3)}) ${currentValue.slice(
      3,
      6
    )}-${currentValue.slice(6, 10)}`;

  // returns: "+x (xxx) xxx-xxxx"
  return `+${currentValue.slice(0, 1)} (${currentValue.slice(
    1,
    4
  )}) ${currentValue.slice(4, 7)}-${currentValue.slice(7, 11)}`;
};
