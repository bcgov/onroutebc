import { OutlinedInput } from "@mui/material";
import { useState } from "react";
import { PathValue, Path } from "react-hook-form";
import { CompanyProfile } from "../../../features/manageProfile/apiManager/manageProfileAPI";
import { CreatePowerUnit } from "../../../features/manageVehicles/types/managevehicles";
import { BC_COLOURS } from "../../../themes/bcGovStyles";
import { CustomInputComponentProps } from "./CustomFormComponents.js";

/**
 * An onRouteBC customized MUI OutlineInput component
 * that automatically changes the format of the phone number as the user types
 */
export const PhoneNumberInput = <T extends CompanyProfile | CreatePowerUnit>(
  props: CustomInputComponentProps<T>
): JSX.Element => {
  // Get the current/default value of the field from React Hook Form
  const defaultVal: PathValue<T, Path<T>> = props.getValues<any>(props.name);
  // Set the value of the field in a useState variable,
  // which is used to automatically format the users input
  const [value, setValue] = useState<PathValue<T, Path<T>> | string>(
    defaultVal
  );

  // Everytime the user types, update the format of the users input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let formattedValue = e.target.value;

    if (props.displayAs === "phone") {
      formattedValue = formatPhoneNumber(e.target.value);
    }

    setValue(formattedValue);
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
      {...props.register(props.name, props.rules)}
      value={value}
      onChange={handleChange}
      autoComplete="tel"
    />
  );
};

/**
 * Function to format the users input to be in the correct phone number format
 * as the user types
 */
const formatPhoneNumber = (input: string): string => {
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

/*
// Remove the '+' for country code if no value or
  // if value length is greater than standard Canada/US phone number
  // (11 digits incl. country code)
  if (cvLength < 1 || cvLength > 11) {
    return currentValue;
  }
  // returns: "+x ",
  if (cvLength < 2) return `+${currentValue}`;

  // returns: "+x x", "+x xx", "+x xxx"
  if (cvLength < 5)
    return `+${currentValue.slice(0, 1)} ${currentValue.slice(1, 4)}`;

  // returns: "+x (xxx)", "+x (xxx) x", "+x (xxx) xx", "+x (xxx) xxx",
  if (cvLength < 8)
    return `+${currentValue.slice(0, 1)} (${currentValue.slice(
      1,
      4
    )}) ${currentValue.slice(4)}`;

  // returns: "+x (xxx) xxx-", "+x (xxx) xxx-x", "+x (xxx) xxx-xx", "+x (xxx) xxx-xxx", "+x (xxx) xxx-xxxx"
  return `+${currentValue.slice(0, 1)} (${currentValue.slice(
    1,
    4
  )}) ${currentValue.slice(4, 7)}-${currentValue.slice(7, 11)}`;
  */
