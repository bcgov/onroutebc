import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Box,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";

import { PERMIT_TYPE_CHOOSE_FROM_OPTIONS } from "../../../../../../constants/constants";
import { SelectPermitType } from "./SelectPermitType";

/**
 *
 * Code taken largely from MUI MenuList Composition
 * https://mui.com/material-ui/react-menu/#menulist-composition
 *
 *
 */
export const StartApplicationButton = () => {
  const navigate = useNavigate();
   const [chooseFrom, setChooseFrom] = useState("");
   const handleChooseFrom = (event: SelectChangeEvent) => {
    setChooseFrom(event.target.value as string);
  };

  const handleStartButtonClicked = () => {
    navigate('/applications/permits');
  }

  return (
    <Stack direction="row" spacing={2}>
      <Box 
      sx={{ display: "flex", gap: "40px" }}
      >
      <SelectPermitType
            value={chooseFrom}
            label={"Select Permit Type"}
            onChange={handleChooseFrom}
            menuItems={PERMIT_TYPE_CHOOSE_FROM_OPTIONS.map((data) => (
              <MenuItem key={data.value} value={data.value} selected={data.label === "Select"}>
                {data.label}
              </MenuItem>
            ))}
            width={"180px"}
          />
        <Button
          variant="contained"
          onClick={handleStartButtonClicked}
          sx={{
            marginTop: "45px",
            height: "50px"
          }}
        >
          Start Application
        </Button>
        </Box>
    </Stack>
  );
};
