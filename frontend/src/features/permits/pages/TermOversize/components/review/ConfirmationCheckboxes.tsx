import { Box, Checkbox, Typography } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";

import "./ConfirmationCheckboxes.scss";
import { CustomInputHTMLAttributes } from "../../../../../../common/types/formElements";

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
    <Box className="confirmation-checkboxes">
      <Typography 
        className="confirmation-checkboxes__header" 
        variant="h3"
      >
        Please read the following carefully and check all to proceed.
      </Typography>
      {checked.map(x => (
        <Box key={x.description}>
          <Checkbox
            className={
              "confirmation-checkboxes__checkbox " + 
              `${isSubmitted && !x.checked ? "confirmation-checkboxes__checkbox--invalid" : ""}`
            }
            key={x.description}
            checked={x.checked}
            onChange={() => handleCheck(x.description)}
            inputProps={{
              "data-testid": "permit-attestation-checkbox"
            } as CustomInputHTMLAttributes}
          />
          {x.description}
        </Box>
      ))}
      {isSubmitted && !isChecked ? (
        <Typography 
          className="confirmation-checkboxes__error"
          data-testid="permit-attestation-checkbox-error"
        >
          Checkbox selection is required.
        </Typography>
      ) : null}
    </Box>
  );
};
