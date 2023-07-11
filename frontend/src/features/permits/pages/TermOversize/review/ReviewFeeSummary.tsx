import { Box, Typography } from "@mui/material";

import "./ReviewFeeSummary.scss";
import { ConfirmationCheckboxes } from "../form/ConfirmationCheckboxes";
import { FeeSummaryBanner } from "./FeeSummaryBanner";

export const ReviewFeeSummary = () => {
  return (
    <Box className="review-fee-summary">
      <Box className="review-fee-summary__header">
        <Typography variant={"h3"}></Typography>
      </Box>
      <Box className="review-fee-summary__body">
        <Box className="fee-summary">
          <FeeSummaryBanner />
          <ConfirmationCheckboxes />
        </Box>
      </Box>
    </Box>
  );
};
