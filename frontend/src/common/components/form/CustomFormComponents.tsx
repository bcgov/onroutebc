import {
  FormControl,
  FormLabel,
  OutlinedInput,
  FormHelperText,
} from "@mui/material";
import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { CompanyInfoFormValues } from "../../../features/manageProfile/components/forms/CompanyInfoForm";
import { CreatePowerUnit } from "../../../features/manageVehicles/types/managevehicles";

/**
 * Custom css overrides for the form fields
 */
interface styleProps {
  fontWeight?: string;
  marginBottom?: string;
  width?: string;
  height?: string;
}
const labelStyleDefault: styleProps = {
  fontWeight: "bold",
  marginBottom: "8px",
  width: "528px",
};
const inputStyleDefault: styleProps = {
  height: "48px",
  width: "528px",
};

export interface CustomOutLinedInputProps<T extends FieldValues> {
  control: Control<T>;
  register: UseFormRegister<T>;
  name: FieldPath<T>;
  rules: RegisterOptions;
  label: string;
  label_i18?: string;
  feature: string;
  inValidMessage: string;
  inValidMessage_i18?: string;
  inValidMessage_fieldName_i18?: string;
  inputProps?: RegisterOptions;
  labelStyle?: styleProps;
  inputStyle?: styleProps;
}

export const CustomOutlinedInput = <
  T extends CompanyInfoFormValues | CreatePowerUnit
>({
  control,
  register,
  name,
  rules,
  label,
  label_i18,
  feature,
  inValidMessage,
  inValidMessage_i18,
  inValidMessage_fieldName_i18,
  inputProps,
  labelStyle = labelStyleDefault,
  inputStyle = inputStyleDefault,
}: CustomOutLinedInputProps<T>): JSX.Element => {
  const { t } = useTranslation();
  return (
    <Controller
      key={`controller-${feature}-${name}`}
      name={name}
      control={control}
      rules={rules}
      render={({ fieldState: { invalid } }) => (
        <>
          <FormControl margin="normal" error={invalid}>
            <FormLabel id={`${feature}-${name}-label`} sx={labelStyle}>
              {label_i18 ? t(label_i18) : label}
              {!rules.required && (
                <span style={{ fontWeight: "normal" }}> (optional)</span>
              )}
            </FormLabel>
            <OutlinedInput
              aria-labelledby={`${feature}-${name}-label`}
              inputProps={inputProps}
              sx={inputStyle}
              {...register(name, rules)}
            />
            {invalid && (
              <FormHelperText error>
                {inValidMessage_i18
                  ? t(inValidMessage_i18, {
                      fieldName: inValidMessage_fieldName_i18,
                    })
                  : inValidMessage}
              </FormHelperText>
            )}
          </FormControl>
        </>
      )}
    />
  );
};
