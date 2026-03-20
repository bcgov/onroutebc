import { FormControl, Checkbox, FormLabel } from "@mui/material";
import { InputHTMLAttributes, ChangeEvent } from "react";
import {
  FieldValues,
  FieldPath,
  Controller,
  useFormContext,
  RegisterOptions,
} from "react-hook-form";

import "./CustomCheckbox.scss";
import { ORBC_FormTypes } from "../../../types/common";

/**
 * Properties of the onrouteBC customized Checkbox MUI component
 */
export interface CustomCheckboxProps<T extends FieldValues> {
  name: FieldPath<T>;
  feature: string;
  label: string;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  checked?: boolean;
  rules?: RegisterOptions;
  handleChange?: (
    event: ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => void;
}

/**
 * An onRouteBC customized MUI Checkbox component
 *
 */
export const CustomCheckbox = <T extends ORBC_FormTypes>(
  props: CustomCheckboxProps<T>,
): JSX.Element => {
  const {
    control,
    register,
  } = useFormContext<T>();

  const className =
    `custom-checkbox__checkbox ${props.inputProps?.className ? props.inputProps.className : ""}`;
  
  return (
    <Controller
      key={`controller-${props.feature}-${props.name}`}
      name={props.name}
      control={control}
      rules={props.rules}
      render={({ fieldState: { invalid }}) => (
        <FormControl className="custom-checkbox">
          <Checkbox
            {...register(props.name, props.rules)}
            checked={props.checked}
            onChange={props.handleChange}
            inputProps={props.inputProps}
            className={`${className} ${invalid ? "custom-checkbox__checkbox--invalid" : ""}`}
          />

          <FormLabel className="custom-checkbox__label">
            {props.label}
          </FormLabel>
        </FormControl>
      )}
    />
  );
};
