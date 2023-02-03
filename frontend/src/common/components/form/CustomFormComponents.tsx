import {
  FormControl,
  FormLabel,
  OutlinedInput,
  FormHelperText,
  Box,
  Select,
  MenuItem,
} from "@mui/material";
import { UseQueryResult } from "@tanstack/react-query";
import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ICompanyInfo } from "../../../features/manageProfile/apiManager/manageProfileAPI";
import {
  CreatePowerUnit,
  PowerUnitType,
} from "../../../features/manageVehicles/types/managevehicles";
import { BC_COLOURS } from "../../../themes/bcGovStyles";

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
 *
 * @returns An onRouteBc customized react form component
 */
export const CustomFormComponent = <T extends ICompanyInfo | CreatePowerUnit>({
  type,
  commonFormProps: { control, register, feature },
  options: {
    name,
    rules,
    label,
    inputProps = rules,
    width = "528px",
    inValidMessage,
    query,
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
                  name={name}
                  rules={rules}
                  inputProps={inputProps}
                  invalid={invalid}
                />
              )}

              {invalid && (
                <FormHelperText error>
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
const CustomSelectComponent = <T extends ICompanyInfo | CreatePowerUnit>({
  register,
  feature,
  name,
  rules,
  query,
}: CustomSelectComponentProps<T>): JSX.Element => {
  return (
    <Select
      aria-labelledby={`${feature}-${name}-label`}
      defaultValue={""}
      sx={{ height: "48px" }}
      {...register(name, rules)}
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
interface CustomInputComponentProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  feature: string;
  name: FieldPath<T>;
  rules: RegisterOptions;
  inputProps: RegisterOptions;
  invalid: boolean;
}

/**
 * An onRouteBC customized MUI OutlineInput component
 * Based on https://mui.com/material-ui/api/outlined-input/
 */
const CustomInputComponent = <T extends ICompanyInfo | CreatePowerUnit>({
  register,
  feature,
  name,
  rules,
  inputProps,
  invalid,
}: CustomInputComponentProps<T>): JSX.Element => {
  return (
    <OutlinedInput
      aria-labelledby={`${feature}-${name}-label`}
      inputProps={inputProps}
      sx={{
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: invalid ? BC_COLOURS.bc_red : BC_COLOURS.focus_blue,
        },
      }}
      {...register(name, rules)}
    />
  );
};
