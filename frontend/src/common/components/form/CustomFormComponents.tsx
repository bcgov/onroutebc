import {
  FormControl,
  FormLabel,
  OutlinedInput,
  FormHelperText,
  Box,
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

export interface CustomOutLinedInputProps<T extends FieldValues> {
  common: {
    control: Control<T>;
    register: UseFormRegister<T>;
    feature: string;
  };
  name: FieldPath<T>;
  rules: RegisterOptions;
  label: string;
  inValidMessage: string;
  options: {
    label_i18?: string;
    inValidMessage_i18?: string;
    inValidMessage_fieldName_i18?: string;
    inputProps?: RegisterOptions;
    width?: string;
  };
}

export const CustomOutlinedInput = <
  T extends CompanyInfoFormValues | CreatePowerUnit
>({
  common: { control, register, feature },
  name,
  rules,
  label,
  inValidMessage,
  options: {
    label_i18,
    inValidMessage_i18,
    inValidMessage_fieldName_i18,
    inputProps,
    width = "528px",
  },
}: CustomOutLinedInputProps<T>): JSX.Element => {
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
                {label_i18 ? t(label_i18) : label}
                {!rules.required && (
                  <span style={{ fontWeight: "normal" }}> (optional)</span>
                )}
              </FormLabel>
              <OutlinedInput
                aria-labelledby={`${feature}-${name}-label`}
                inputProps={inputProps}
                sx={{ height: "48px" }}
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
    </Box>
  );
};
