import { Box, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

import "./ReviewFeeSummary.scss";
import { FeeSummaryBanner } from "./FeeSummaryBanner";
import { ConfirmationCheckboxes } from "./ConfirmationCheckboxes";

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
        <Box className="fee-summary-wrapper">
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
