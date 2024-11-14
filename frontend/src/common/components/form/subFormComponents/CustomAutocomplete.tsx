import {
  Autocomplete,
  AutocompleteProps,
  FormControl,
  FormHelperText,
  FormLabel,
  TextField,
} from "@mui/material";

import "./CustomAutocomplete.scss";
import { getDefaultRequiredVal } from "../../../helpers/util";

type CustomAutocompleteClassKey =
  "root" | "label";

export interface CustomAutocompleteProps<
  Value,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
  ChipComponent extends React.ElementType,
> {
  classes?: Partial<Record<CustomAutocompleteClassKey, string>>;
  label?: {
    id: string;
    component: React.ReactNode;
  };
  helperText?: {
    messages?: string[];
    errors?: string[];
  };
  autocompleteProps: Omit<
    AutocompleteProps<Value, Multiple, DisableClearable, FreeSolo, ChipComponent>,
    "renderInput"
  >;
}

export const CustomAutocomplete = <
  Value,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
  ChipComponent extends React.ElementType = "div",
>(props: CustomAutocompleteProps<
  Value,
  Multiple,
  DisableClearable,
  FreeSolo,
  ChipComponent
>) => {
  const helperMessages = getDefaultRequiredVal([], props.helperText?.messages);
  const errorMessages = getDefaultRequiredVal([], props.helperText?.errors);
  const helperTexts = [
    ...helperMessages.map(message => ({
      type: "message",
      message,
    })),
    ...errorMessages.map(message => ({
      type: "error",
      message,
    })),
  ];

  return (
    <FormControl
      margin="normal"
      className={`
        custom-autocomplete ${
          props.classes?.root ? props.classes.root : ""
        } ${
          errorMessages.length > 0 ? "custom-autocomplete--error" : ""
        }
      `}
      error={errorMessages.length > 0}
    >
      {props.label ? (
        <FormLabel
          id={props.label.id}
          className={`custom-autocomplete__label ${
            props.classes?.label ? props.classes.label : ""
          }`}
        >
          {props.label.component}
        </FormLabel>
      ) : null}

      <Autocomplete
        {...props.autocompleteProps}
        className={
          `custom-autocomplete__autocomplete ${
            props.autocompleteProps.className ? props.autocompleteProps.className : ""
          }`
        }
        renderInput={(params) => (
          <TextField
            {...{
              ...params,
              inputProps: {
                ...params.inputProps,
                className: `
                  custom-autocomplete__input ${params.inputProps.className ? params.inputProps.className : ""}
                `,
              },
              className: "custom-autocomplete__textfield",
            }}
          />
        )}
      />

      {helperTexts.length > 0 ? (
        <div className="custom-autocomplete__helper-texts">
          {helperTexts.map(({ message, type }) => (
            <FormHelperText
              key={message}
              className={`
                custom-autocomplete__helper-text ${type === "error" ? "custom-autocomplete__helper-text--error" : ""}
              `}
              error={type === "error"}
            >
              {message}
            </FormHelperText>
          ))}
        </div>
      ) : null}
    </FormControl>
  );
};
