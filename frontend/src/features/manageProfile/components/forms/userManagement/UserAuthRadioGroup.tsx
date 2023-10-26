import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
} from "@mui/material";
import { CustomInputHTMLAttributes } from "../../../../../common/types/formElements";
import { BCEID_AUTH_GROUP } from "../../../types/userManagement.d";
import "../myInfo/MyInfoForm.scss";
import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
} from "react-hook-form";

/**
 * A reusable react component for capturing user auth group in add/edit user forms.
 */
export const UserAuthRadioGroup = ({
  field,
  fieldState,
}: {
  field: ControllerRenderProps<FieldValues, "userAuthGroup">;
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
          value={BCEID_AUTH_GROUP.ORGADMIN}
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
          value={BCEID_AUTH_GROUP.CVCLIENT}
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
