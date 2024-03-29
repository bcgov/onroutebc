import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, DateValidationError } from "@mui/x-date-pickers";
import { useState, useEffect } from "react";
import {
  FieldValues,
  FieldPath,
  useFormContext,
  useController,
} from "react-hook-form";

import "./CustomDatePicker.scss";
import { ORBC_FormTypes, RequiredOrNull } from "../../../types/common";
import { now } from "../../../helpers/formatDate";
import {
  invalidDate,
  invalidMaxStartDate,
  invalidPastStartDate,
} from "../../../helpers/validationMessages";

/**
 * Properties of the onrouteBC customized Date Picker MUI component
 */
export interface CustomDatePickerProps<T extends FieldValues> {
  feature: string;
  name: FieldPath<T>;
  disabled?: boolean;
  readOnly?: boolean;
}

/**
 * An onRouteBC customized MUI Date Picker component
 * Based on https://mui.com/x/react-date-pickers/date-picker/
 *
 */
export const CustomDatePicker = <T extends ORBC_FormTypes>({
  feature,
  name,
  disabled,
  readOnly,
}: CustomDatePickerProps<T>): JSX.Element => {
  const {
    trigger,
    formState: { isSubmitted },
    control,
  } = useFormContext();

  // User can only select a date that is up to 14 days into the future of the current date
  const maxDate = now().add(14, "day");

  /**
   * DatePicker is tricky, because in theory, you have two components with event listeners.
   * I was able to register the date picker field to React Hook Forms by using the useController hook
   * instead of using {...register(props.name, props.rules)}
   * There may be a better solution.
   * Referenced: https://www.reddit.com/r/reactjs/comments/udzhh7/reacthookform_not_working_with_mui_datepicker/
   */
  const {
    field: { onChange, value, ref },
  } = useController({ name, control });

  /**
   * React Hook Forms was not registering the validation errors from MUI Date Picker.
   * Therefore, I had to manually set the React Hook Form validation error based on MUI's error
   * There may be a better solution.
   * Reference: https://mui.com/x/react-date-pickers/validation/#show-the-error
   */
  const { setError, clearErrors } = useFormContext();
  const [muiError, setMuiError] =
    useState<RequiredOrNull<DateValidationError>>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    switch (muiError) {
      case "minDate":
      case "disablePast": {
        setError(name, { type: "focus" }, { shouldFocus: true });
        setErrorMessage(invalidPastStartDate());
        break;
      }
      case "maxDate": {
        setError(name, { type: "focus" }, { shouldFocus: true });
        setErrorMessage(invalidMaxStartDate(14));
        break;
      }
      case "invalidDate": {
        setError(name, { type: "focus" }, { shouldFocus: true });
        setErrorMessage(invalidDate());
        break;
      }
      default: {
        clearErrors(name);
        setErrorMessage("");
        break;
      }
    }
  }, [muiError]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        className={`custom-date-picker ${disabled ? "custom-date-picker--disabled" : ""}`}
        key={`${feature}-date-picker`}
        ref={ref}
        value={value}
        disabled={disabled}
        readOnly={readOnly}
        onChange={onChange}
        disablePast
        maxDate={maxDate}
        onError={(newError) => setMuiError(newError)}
        slotProps={{
          textField: {
            helperText: errorMessage,
            inputProps: {
              className: "custom-date-picker__input-container",
            },
          },
        }}
        // This onClose function fixes a bug where the Select component does not immediately
        // revalidate when selecting an option after an invalid form submission.
        // The validation needed to be triggered again manually
        onClose={async () => {
          if (isSubmitted) {
            const output = await trigger(name);
            if (!output) {
              trigger(name);
            }
          }
        }}
      />
    </LocalizationProvider>
  );
};
