import {
  FormControl,
  FormLabel,
  OutlinedInput,
  FormHelperText,
} from "@mui/material";
import {
  Control,
  Controller,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";
import { CompanyInfoFormValues } from "../../../features/manageProfile/components/forms/CompanyInfoForm";

/**
 * Custom css overrides for the form fields
 */
const labelStyle = {
  fontWeight: "bold",
  marginBottom: "8px",
  width: "528px",
};
const inputStyle = {
  height: "48px",
  width: "528px",
};

export interface CustomOutLinesInputType {
  control: Control<CompanyInfoFormValues>;
  register: UseFormRegister<CompanyInfoFormValues>;
  name: Path<CompanyInfoFormValues>;
  rules: RegisterOptions;
  label: string;
  feature: string;
  inValidMessage: string;
}

export const CustomOutlinedInput = ({
  control,
  register,
  name,
  rules,
  label,
  feature,
  inValidMessage,
}: CustomOutLinesInputType): JSX.Element => (
  <Controller
    key={`controller-${feature}-${name}-label`}
    name={name}
    control={control}
    rules={{ required: true }}
    render={({ fieldState: { invalid } }) => (
      <>
        <FormControl margin="normal" error={invalid}>
          <FormLabel id={`${feature}-${name}-label`} sx={labelStyle}>
            {label}
          </FormLabel>
          <OutlinedInput
            aria-labelledby={`${feature}-${name}-label`}
            sx={inputStyle}
            {...register(name, rules)}
          />
          {invalid && <FormHelperText error>{inValidMessage}</FormHelperText>}
        </FormControl>
      </>
    )}
  />
);
