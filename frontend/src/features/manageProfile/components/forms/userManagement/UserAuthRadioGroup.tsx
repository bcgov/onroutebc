import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
} from "@mui/material";
import { CustomInputHTMLAttributes } from "../../../../../common/types/formElements";
import "../myInfo/MyInfoForm.scss";
import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
} from "react-hook-form";
import { BCeID_USER_ROLE } from "../../../../../common/authentication/types";

/**
 * A reusable react component for capturing user role in add/edit user forms.
 */
export const UserAuthRadioGroup = ({
  field,
  fieldState,
}: {
  field: ControllerRenderProps<FieldValues, "userRole">;
  fieldState: ControllerFieldState;
}) => {
  const { invalid } = fieldState;
  return (
    <FormControl>
      <RadioGroup
        {...field}
        value={field.value}
        aria-labelledby="radio-buttons-group-label"
      >
        <FormControlLabel
          value={BCeID_USER_ROLE.COMPANY_ADMINISTRATOR}
          control={
            <Radio
              key={`radio-bceid-administrator`}
              inputProps={
                {
                  "data-testid": "save-vehicle-yes",
                } as CustomInputHTMLAttributes
              }
            />
          }
          label="Administrator"
        />
        <FormControlLabel
          value={BCeID_USER_ROLE.PERMIT_APPLICANT}
          control={
            <Radio
              key={`radio-bceid-permit-applicant`}
              inputProps={
                {
                  "data-testid": "save-vehicle-no",
                } as CustomInputHTMLAttributes
              }
            />
          }
          label="Permit Applicant"
        />
      </RadioGroup>
      {invalid && <FormHelperText>You must assign a user group</FormHelperText>}
    </FormControl>
  );
};
