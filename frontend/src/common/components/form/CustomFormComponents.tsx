import {
  FormControl,
  FormLabel,
  OutlinedInput,
  FormHelperText,
  Box,
  Select,
  MenuItem,
  Checkbox,
} from "@mui/material";
import { UseQueryResult } from "@tanstack/react-query";
import { ChangeEvent, InputHTMLAttributes } from "react";
import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  RegisterOptions,
  UseFormGetValues,
  UseFormRegister,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { CompanyProfile } from "../../../features/manageProfile/apiManager/manageProfileAPI";
import {
  CreatePowerUnit,
  PowerUnitType,
} from "../../../features/manageVehicles/types/managevehicles";
import { BC_COLOURS } from "../../../themes/bcGovStyles";

import { PhoneNumberInput } from "./PhoneNumberInput";

/**
 * Properties of onRouteBC custom form components
 * Types that are supported include MUI OutlinedInput and Select components
 */
export interface CustomFormComponentProps<T extends FieldValues> {
  type: "input" | "select";
  commonFormProps: CommonFormPropsType<T>;
  options: CustomFormOptionsProps<T>;
  i18options?: {
    label_i18?: string;
    inValidMessage_i18?: string;
    inValidMessage_fieldName_i18?: string;
  };
}

/**
 * Properties of the common required properties for the onrouteBC custom form component
 */
export interface CommonFormPropsType<T extends FieldValues> {
  control: Control<T>;
  register: UseFormRegister<T>;
  feature: string;
  getValues: UseFormGetValues<T>;
}

/**
 * onRouteBC Custom Form Options must include the name of the field and validation rules
 */
interface CustomFormOptionsProps<T extends FieldValues> {
  name: FieldPath<T>;
  rules: RegisterOptions;
  label?: string;
  inputProps?: RegisterOptions;
  width?: string;
  inValidMessage?: string;
  query?: UseQueryResult<PowerUnitType[], unknown>;
  displayAs?: "phone";
  customHelperText?: string;
}

/**
 * This onRouteBC Custom Form component abstracts the MUI / React Hook form code
 * to allow for simple reusable form components.
 *
 * Default values are implicitly used and should be provided in the parent component using the useForm() method of react-hook-form
 *
 * The component is styled using inline sx styles and use the theme defined in "\src\themes\bcGovTheme.ts"
 *
 * This is a generic type component but includes type checking for certain data types (Example: PowerUnits or Company Info)
 *
 * @param type Select the type of form component (example: "select" for MUI Select dropdown)
 * @param commonFormProps These properties are specific to React Hook Form integration
 * @param control This object contains methods for registering components into React Hook Form.
 * @param register This method allows you to register an input or select element and apply validation rules to React Hook Form.
 * @param feature The onRouteBC feature that the form is associated with.Used for key's and id's.
 * @param options These options are used to customize the component through styles, validation rules, and TanStack React Query integration
 * @param name The name of the field, which is the Unique name of your input.
 * @param label Display text for the field. Must be identical to the value in i18/translations/en.json if integrating with i18
 * @param inputProps MUI component attributes applied to the input element.
 * @param width Width of the MUI Box container that contains all of the code for the form component
 * @param inValidMessage Red text shown on React Hook Form field invalidation
 * @param query TanStack React Query integration object (https://tanstack.com/query/v4/docs/react/reference/useQuery)
 * @param i18options Optional Internationalization integration using i18
 * @param displayAs Type of the data to be formatted and displayed as to the user
 * @param customHelperText Non-bold text to appear in parenthesis beside the label
 *
 * @returns An onRouteBc customized react form component
 */
export const CustomFormComponent = <
  T extends CompanyProfile | CreatePowerUnit
>({
  type,
  commonFormProps: { control, register, feature, getValues },
  options: {
    name,
    rules,
    label,
    inputProps = rules,
    width = "528px",
    inValidMessage,
    query,
    displayAs: displayAs,
    customHelperText,
  },
  i18options,
}: CustomFormComponentProps<T>): JSX.Element => {
  const { t } = useTranslation();
  return (
    <Box sx={{ width: width }}>
      <Controller
        key={`controller-${feature}-${name}`}
        name={name}
        control={control}
        rules={rules}
        render={({ fieldState: { invalid } }) => (
          <>
            <FormControl margin="normal" error={invalid} sx={{ width: "100%" }}>
              <FormLabel
                id={`${feature}-${name}-label`}
                sx={{ fontWeight: "bold", marginBottom: "8px" }}
              >
                {i18options?.label_i18 ? t(i18options?.label_i18) : label}
                {!rules.required && (
                  <span style={{ fontWeight: "normal" }}> (optional)</span>
                )}
                {customHelperText && (
                  <span style={{ fontWeight: "normal" }}>
                    {` (${customHelperText})`}
                  </span>
                )}
              </FormLabel>
              {type === "select" ? (
                <CustomSelectComponent
                  register={register}
                  feature={feature}
                  name={name}
                  rules={rules}
                  query={query}
                />
              ) : (
                <CustomInputComponent
                  register={register}
                  feature={feature}
                  getValues={getValues}
                  name={name}
                  rules={rules}
                  inputProps={inputProps}
                  invalid={invalid}
                  displayAs={displayAs}
                />
              )}

              {invalid && (
                <FormHelperText data-testid={`alert-${name}`} error>
                  {i18options?.inValidMessage_i18
                    ? t(i18options?.inValidMessage_i18, {
                        fieldName: label,
                      })
                    : inValidMessage}
                </FormHelperText>
              )}
            </FormControl>
          </>
        )}
      />
    </Box>
  );
};

/**
 * Properties of the onrouteBC customized Select MUI component
 */
interface CustomSelectComponentProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  feature: string;
  name: FieldPath<T>;
  rules: RegisterOptions;
  query?: UseQueryResult<PowerUnitType[], unknown>;
}

/**
 * An onRouteBC customized MUI Select component
 * Based on https://mui.com/material-ui/react-select/
 */
const CustomSelectComponent = <T extends CompanyProfile | CreatePowerUnit>({
  register,
  feature,
  name,
  rules,
  query,
}: CustomSelectComponentProps<T>): JSX.Element => {
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
      {query?.data?.map((powerUnitType: PowerUnitType) => (
        <MenuItem
          key={`${feature}-${name}-${powerUnitType.typeCode}`}
          value={powerUnitType.typeCode}
        >
          {powerUnitType.type}
        </MenuItem>
      ))}
    </Select>
  );
};

/**
 * Properties of the onrouteBC customized OutlineInput MUI component
 */
export interface CustomInputComponentProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  feature: string;
  getValues: UseFormGetValues<T>;
  name: FieldPath<T>;
  rules: RegisterOptions;
  inputProps: RegisterOptions;
  invalid: boolean;
  displayAs?: string;
}

/**
 * An onRouteBC customized MUI OutlineInput component
 * Based on https://mui.com/material-ui/api/outlined-input/
 *
 */
const CustomInputComponent = <T extends CompanyProfile | CreatePowerUnit>(
  props: CustomInputComponentProps<T>
): JSX.Element => {
  // Use Custom Phone Number component
  if (props.displayAs == "phone") {
    return <PhoneNumberInput {...props} />;
  }

  // Add aria-label to input prop for Jest testing purposes
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
      {...props.register(props.name, props.rules)}
    />
  );
};

/**
 * Properties of the onrouteBC customized Checkbox MUI component
 */
export interface CustomCheckboxComponentProps<T extends FieldValues> {
  commonFormProps: CommonFormPropsType<T>;
  name: FieldPath<T>;
  label: string;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  checked: boolean;
  handleOnChange: (
    event: ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => void;
}

/**
 * An onRouteBC customized MUI Checkbox component
 *
 */
export const CustomCheckboxComponent = <
  T extends CompanyProfile | CreatePowerUnit
>(
  props: CustomCheckboxComponentProps<T>
): JSX.Element => {
  return (
    <Controller
      key={`controller-${props.commonFormProps.feature}-${props.name}`}
      name={props.name}
      control={props.commonFormProps.control}
      render={() => (
        <>
          <FormControl>
            <div>
              <Checkbox
                {...props.commonFormProps.register(props.name)}
                checked={props.checked}
                onChange={props.handleOnChange}
                inputProps={props.inputProps}
                sx={{ marginLeft: "0px", paddingLeft: "0px" }}
              />
              <FormLabel>{props.label}</FormLabel>
            </div>
          </FormControl>
        </>
      )}
    />
  );
};
