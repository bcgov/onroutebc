import { Box, Typography } from "@mui/material";

import "./ReviewFeeSummary.scss";
import { ConfirmationCheckboxes } from "../form/ConfirmationCheckboxes";
import { FeeSummaryBanner } from "./FeeSummaryBanner";
import { Dispatch, SetStateAction } from "react";

export const ReviewFeeSummary = ({
  isSubmitted,
  isChecked,
  setIsChecked,
}: {
  isSubmitted: boolean;
  isChecked: boolean;
  setIsChecked: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <Box className="review-fee-summary">
      <Box className="review-fee-summary__header">
        <Typography variant={"h3"}></Typography>
      </Box>
      <Box className="review-fee-summary__body">
        <Box className="fee-summary">
          <FeeSummaryBanner />
          <ConfirmationCheckboxes
            isSubmitted={isSubmitted}
            isChecked={isChecked}
            setIsChecked={setIsChecked}
          />
        </Box>
      </Box>
    </Box>
  );
};
