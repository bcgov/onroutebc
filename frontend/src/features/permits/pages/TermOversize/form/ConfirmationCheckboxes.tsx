import { Box, Checkbox, Typography } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { BC_COLOURS } from "../../../../../themes/bcGovStyles";

export const ConfirmationCheckboxes = ({
  isSubmitted,
  isChecked,
  setIsChecked,
}: {
  isSubmitted: boolean;
  isChecked: boolean;
  setIsChecked: Dispatch<SetStateAction<boolean>>;
}) => {
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
    let isValid = true;
    const updated = checked.map((item) => {
      if (item.description === checkedName) {
        item.checked = !item.checked;
      }
      if (!item.checked) isValid = false;
      return item;
    });
    setChecked(updated);
    setIsChecked(isValid);
  };

  return (
    <Box sx={{ paddingTop: "24px" }}>
      {checked.map((x, index) => (
        <Box key={x.description}>
          <Checkbox
            key={x.description}
            checked={x.checked}
            onChange={() => handleCheck(x.description)}
            sx={{
              color:
                isSubmitted && !x.checked
                  ? BC_COLOURS.bc_red
                  : BC_COLOURS.bc_primary_blue,
            }}
          />
          {x.description}
        </Box>
      ))}
      {isSubmitted && !isChecked ? (
        <Typography sx={{ color: BC_COLOURS.bc_red }}>
          Checkbox selection is required.
        </Typography>
      ) : null}
    </Box>
  );
};
