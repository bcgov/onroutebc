import { Box, Typography } from "@mui/material";
import {
  PERMIT_MAIN_BOX_STYLE,
  PERMIT_LEFT_BOX_STYLE,
  PERMIT_LEFT_HEADER_STYLE,
  PERMIT_RIGHT_BOX_STYLE,
} from "../../../../../themes/orbcStyles";
import { ConfirmationCheckboxes } from "../form/ConfirmationCheckboxes";
import { FeeSummaryBanner } from "./FeeSummaryBanner";

export const ReviewFeeSummary = () => {
  return (
    <Box sx={PERMIT_MAIN_BOX_STYLE}>
      <Box sx={PERMIT_LEFT_BOX_STYLE}>
        <Typography variant={"h3"} sx={PERMIT_LEFT_HEADER_STYLE}></Typography>
      </Box>
      <Box sx={PERMIT_RIGHT_BOX_STYLE}>
        <Box sx={{ gap: "40px", paddingTop: "24px" }}>
          <FeeSummaryBanner />
          <ConfirmationCheckboxes />
        </Box>
      </Box>
    </Box>
  );
};
