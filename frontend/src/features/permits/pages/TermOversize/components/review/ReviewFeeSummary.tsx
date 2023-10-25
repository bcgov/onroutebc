import { Box, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

import "./ReviewFeeSummary.scss";
import { ConfirmationCheckboxes } from "./ConfirmationCheckboxes";
import { FeeSummary } from "../../../../components/feeSummary/FeeSummary";
import { PermitType } from "../../../../types/PermitType";

export const ReviewFeeSummary = ({
  isSubmitted,
  isChecked,
  setIsChecked,
  permitType,
  fee,
}: {
  isSubmitted: boolean;
  isChecked: boolean;
  setIsChecked: Dispatch<SetStateAction<boolean>>;
  permitType?: PermitType;
  fee: string;
}) => {
  return (
    <Box className="review-fee-summary">
      <Box className="review-fee-summary__header">
        <Typography variant={"h3"}></Typography>
      </Box>
      <Box className="review-fee-summary__body">
        <Box className="fee-summary-wrapper">
          <FeeSummary
            permitType={permitType}
            feeSummary={fee}
          />

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
