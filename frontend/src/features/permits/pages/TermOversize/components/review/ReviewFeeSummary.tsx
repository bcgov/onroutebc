import { Box, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

import "./ReviewFeeSummary.scss";
import { ConfirmationCheckboxes } from "./ConfirmationCheckboxes";
import { calculateFeeByDuration } from "../../../../helpers/feeSummary";
import { getDefaultRequiredVal } from "../../../../../../common/helpers/util";
import { FeeSummary } from "../../../../components/feeSummary/FeeSummary";
import { PermitType } from "../../../../types/PermitType";

export const ReviewFeeSummary = ({
  isSubmitted,
  isChecked,
  setIsChecked,
  permitType,
  permitDuration,
}: {
  isSubmitted: boolean;
  isChecked: boolean;
  setIsChecked: Dispatch<SetStateAction<boolean>>;
  permitType?: PermitType;
  permitDuration?: number;
}) => {
  const calculatedFee = calculateFeeByDuration(
    getDefaultRequiredVal(0, permitDuration)
  );

  return (
    <Box className="review-fee-summary">
      <Box className="review-fee-summary__header">
        <Typography variant={"h3"}></Typography>
      </Box>
      <Box className="review-fee-summary__body">
        <Box className="fee-summary-wrapper">
          <FeeSummary
            permitType={permitType}
            feeSummary={`${calculatedFee}`}
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
