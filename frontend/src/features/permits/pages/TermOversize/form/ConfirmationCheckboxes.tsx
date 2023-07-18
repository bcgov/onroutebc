import { Box, Checkbox, Typography } from "@mui/material";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { BC_COLOURS } from "../../../../../themes/bcGovStyles";
import { CustomInputHTMLAttributes } from "../../../../../common/types/formElements";

export const ConfirmationCheckboxes = () => {
  const checkboxes = [
    {
      description:
        "I confirm that this permit is issued to the registered owner (or lessee) of the vehicle being permitted.",
      checked: false,
    },
    {
      description:
        "I confirm I am compliant with the appropriate policy for my selected commodity(s).",
      checked: false,
    },
    {
      description: "I confirm the information in this application is correct.",
      checked: false,
    },
  ];
  const [checked, setChecked] = useState(checkboxes);

  const handleCheck = (checkedName: string) => {
    const updated = checked.map((item) => {
      if (item.description === checkedName) {
        item.checked = !item.checked;
      }
      return item;
    });
    setChecked(updated);
  };

  const {
    register,
    formState: { isValid, isSubmitted },
  } = useFormContext();

  return (
    <Box sx={{ paddingTop: "24px" }}>
      {checked.map((x, index) => (
        <Box key={x.description}>
          <Checkbox
            {...register(`checkbox #${index}`, { required: true })}
            key={x.description}
            checked={x.checked}
            onChange={() => handleCheck(x.description)}
            sx={{
              color:
                isSubmitted && !isValid && !x.checked
                  ? BC_COLOURS.bc_red
                  : BC_COLOURS.bc_primary_blue,
            }}
            inputProps={{
              "data-testid": "permit-attestation-checkbox"
            } as CustomInputHTMLAttributes}
          />
          {x.description}
        </Box>
      ))}
      {isSubmitted && !isValid ? (
        <Typography 
          sx={{ color: BC_COLOURS.bc_red }}
          data-testid="permit-attestation-checkbox-error"
        >
          Checkbox selection is required.
        </Typography>
      ) : null}
    </Box>
  );
};
