import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Box, MenuItem, SelectChangeEvent, Button } from "@mui/material";

import "./StartApplicationAction.scss";
import { PERMIT_TYPE_CHOOSE_FROM_OPTIONS } from "../../../../constants/constants";
import { SelectPermitType } from "./SelectPermitType";
import { PERMIT_TYPES } from "../../../../types/PermitType";
import { APPLICATIONS_ROUTES } from "../../../../../../routes/constants";

/**
 *
 * Code taken largely from MUI MenuList Composition
 * https://mui.com/material-ui/react-menu/#menulist-composition
 *
 *
 */
export const StartApplicationAction = () => {
  const navigate = useNavigate();
  const [chooseFrom, setChooseFrom] = useState<string>(PERMIT_TYPES.TROS);
  const handleChooseFrom = (event: SelectChangeEvent) => {
    setChooseFrom(event.target.value);
  };

  const handleStartButtonClicked = () => {
    navigate(APPLICATIONS_ROUTES.START_APPLICATION);
  };

  return (
    <Box className="start-application-action">
      <SelectPermitType
        value={chooseFrom}
        label={"Select Permit Type"}
        onChange={handleChooseFrom}
        menuItems={PERMIT_TYPE_CHOOSE_FROM_OPTIONS.map((data) => (
          <MenuItem key={data.value} value={data.value}>
            {data.label}
          </MenuItem>
        ))}
      />

      <Button
        className="start-application-action__btn"
        variant="contained"
        onClick={handleStartButtonClicked}
      >
        Start Application
      </Button>
    </Box>
  );
};
