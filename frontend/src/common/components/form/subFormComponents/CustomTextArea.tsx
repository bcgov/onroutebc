import {
  FieldValues,
  FieldPath,
  RegisterOptions,
  useFormContext,
} from "react-hook-form";

import "./CustomTextArea.scss";
import { ORBC_FormTypes } from "../../../types/common";

/**
 * Properties of the onrouteBC customized textarea component
 */
export interface CustomTextAreaProps<T extends FieldValues> {
  feature: string;
  name: FieldPath<T>;
  rules: RegisterOptions;
  inputProps: RegisterOptions;
  invalid: boolean;
  disabled?: boolean;
  readOnly?: boolean;
}

export const CustomTextArea = <T extends ORBC_FormTypes>(
  props: CustomTextAreaProps<T>
): JSX.Element => {
  const { register } = useFormContext();

  return (
    <textarea 
      className={`custom-text-area custom-text-area--${props.name} ${props.invalid ? "custom-text-area--err" : ""}`}
      rows={6}
      {...register(props.name, props.rules)}
    >
    </textarea>
  );
};
