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

export interface CommonFormPropsType<T extends FieldValues> {
  control: Control<T>;
  register: UseFormRegister<T>;
  feature: string;
}

export interface CustomOutLinedInputProps<T extends FieldValues> {
  common: CommonFormPropsType<T>;
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

export const CustomOutlinedInput = <T extends ICompanyInfo | CreatePowerUnit>({
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
                sx={{
                  height: "48px",
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "2px solid",
                    borderColor: invalid
                      ? BC_COLOURS.bc_red
                      : BC_COLOURS.focus_blue,
                    boxShadow: `0px 4px 8px ${BC_COLOURS.shadow_colour}`,
                  },
                }}
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

export interface CustomSelectProps<T extends FieldValues> {
  common: CommonFormPropsType<T>;
  name: FieldPath<T>;
  rules: RegisterOptions;
  label: string;
  inValidMessage: string;
  options: {
    label_i18?: string;
    inValidMessage_i18?: string;
    inValidMessage_fieldName_i18?: string;
    width?: string;
  };
  powerUnitTypesQuery: UseQueryResult<PowerUnitType[], unknown>;
}

export const CustomSelect = <T extends ICompanyInfo | CreatePowerUnit>({
  common: { control, register, feature },
  name,
  rules,
  label,
  inValidMessage,
  options: {
    label_i18,
    inValidMessage_i18,
    inValidMessage_fieldName_i18,
    width = "528px",
  },
  powerUnitTypesQuery,
}: CustomSelectProps<T>): JSX.Element => {
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
              <Select
                aria-labelledby={`${feature}-${name}-label`}
                defaultValue={""}
                sx={{ height: "48px" }}
                {...register(name, rules)}
              >
                {powerUnitTypesQuery.data?.map(
                  (powerUnitType: PowerUnitType) => (
                    <MenuItem
                      key={`${feature}-${name}-${powerUnitType.typeCode}`}
                      value={powerUnitType.typeCode}
                    >
                      {powerUnitType.type}
                    </MenuItem>
                  )
                )}
              </Select>
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
