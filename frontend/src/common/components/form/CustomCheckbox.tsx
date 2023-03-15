import { FormControl, Checkbox, FormLabel } from "@mui/material";
import { InputHTMLAttributes, ChangeEvent } from "react";
import {
  FieldValues,
  FieldPath,
  Controller,
  useFormContext,
} from "react-hook-form";
import { CompanyProfile } from "../../../features/manageProfile/apiManager/manageProfileAPI";
import { CreatePowerUnit } from "../../../features/manageVehicles/types/managevehicles";

/**
 * Properties of the onrouteBC customized Checkbox MUI component
 */
export interface CustomCheckboxProps<T extends FieldValues> {
  name: FieldPath<T>;
  feature: string;
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
export const CustomCheckbox = <T extends CompanyProfile | CreatePowerUnit>(
  props: CustomCheckboxProps<T>
): JSX.Element => {
  const { control, register } = useFormContext();
  return (
    <Controller
      key={`controller-${props.feature}-${props.name}`}
      name={props.name}
      control={control}
      render={() => (
        <>
          <FormControl>
            <div>
              <Checkbox
                {...register(props.name)}
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
