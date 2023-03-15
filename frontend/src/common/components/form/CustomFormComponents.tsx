import { FormControl, FormLabel, FormHelperText, Box } from "@mui/material";
import {
  Controller,
  FieldPath,
  FieldValues,
  RegisterOptions,
  useFormContext,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { CompanyProfile } from "../../../features/manageProfile/apiManager/manageProfileAPI";
import { CreatePowerUnit } from "../../../features/manageVehicles/types/managevehicles";
import { CustomOutlinedInput } from "./subFormComponents/CustomOutlinedInput";
import { CustomSelect } from "./subFormComponents/CustomSelect";
import { PhoneNumberInput } from "./subFormComponents/PhoneNumberInput";

/**
 * Properties of onRouteBC custom form components
 * Types that are supported include MUI OutlinedInput and Select components
 */
export interface CustomFormComponentProps<T extends FieldValues> {
  type: "input" | "select" | "phone";
  feature: string;
  options: CustomFormOptionsProps<T>;
  i18options?: i18optionsProps;
  menuOptions?: JSX.Element[];
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
  customHelperText?: string;
}

interface i18optionsProps {
  label_i18?: string;
  inValidMessage_i18?: string;
  inValidMessage_fieldName_i18?: string;
}

/**
 * This onRouteBC Custom Form component abstracts the MUI / React Hook form code to allow for simple reusable form components.
 *
 * Default values should be provided in the parent component using the useForm() method of react-hook-form
 *
 * The component is styled using inline sx styles and use the theme defined in "\src\themes\bcGovTheme.ts"
 *
 * @param type Select the type of form component (example: "select" for MUI Select dropdown)
 * @param feature The onRouteBC feature that the form is associated with.Used for key's and id's.
 * @param options These options are used to customize the component through styles, validation rules, and TanStack React Query integration
 * @param name The name of the field, which is the Unique name of your input.
 * @param rules Validation rules such as required, min, max, etc
 * @param label Text to label the field. Must be identical to the value in i18/translations/en.json if integrating with i18
 * @param inputProps MUI component attributes applied to the html input element.
 * @param width Width of the MUI Box container that contains all of the code for the form component. Defaults t0 520px
 * @param inValidMessage Red text shown on React Hook Form field invalidation
 * @param i18options Optional Internationalization integration using i18
 * @param customHelperText Non-bold text to appear in parenthesis beside the label
 * @param menuOptions Menu items array for MUI Select component
 *
 * @returns An onRouteBc customized react form component
 */
export const CustomFormComponent = <
  T extends CompanyProfile | CreatePowerUnit
>({
  type,
  feature,
  options: {
    name,
    rules,
    label,
    inputProps = rules,
    width = "528px",
    inValidMessage,
    customHelperText,
  },
  i18options,
  menuOptions,
}: CustomFormComponentProps<T>): JSX.Element => {
  const { control } = useFormContext();
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
                <CustomSelect
                  feature={feature}
                  name={name}
                  rules={rules}
                  menuOptions={menuOptions}
                />
              ) : type === "phone" ? (
                <PhoneNumberInput
                  feature={feature}
                  name={name}
                  rules={rules}
                  inputProps={inputProps}
                  invalid={invalid}
                />
              ) : (
                <CustomOutlinedInput
                  feature={feature}
                  name={name}
                  rules={rules}
                  inputProps={inputProps}
                  invalid={invalid}
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
