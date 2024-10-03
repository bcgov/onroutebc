import { Box, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

import "./ReviewFeeSummary.scss";
import { ConfirmationCheckboxes } from "./ConfirmationCheckboxes";
import { FeeSummary } from "../../../../components/feeSummary/FeeSummary";
import { PermitType } from "../../../../types/PermitType";
import { Nullable } from "../../../../../../common/types/common";
import { PermitReviewContext } from "../../../../types/PermitReviewContext";

export const ReviewFeeSummary = ({
  isSubmitted,
  isChecked,
  setIsChecked,
  permitType,
  fee,
  reviewContext,
}: {
  isSubmitted: boolean;
  isChecked: boolean;
  setIsChecked: Dispatch<SetStateAction<boolean>>;
  permitType?: Nullable<PermitType>;
  fee: string;
  reviewContext?: Nullable<PermitReviewContext>;
}) => {
  return (
    <Box className="review-fee-summary">
      <Box className="review-fee-summary__header">
        <Typography variant={"h3"}></Typography>
      </Box>
      <Box className="review-fee-summary__body">
        <Box className="fee-summary-wrapper">
          <FeeSummary permitType={permitType} feeSummary={fee} />

          <ConfirmationCheckboxes
            isSubmitted={isSubmitted}
            isChecked={isChecked}
            setIsChecked={setIsChecked}
            isDisabled={reviewContext === "QUEUE"}
          />
        </Box>
      </Box>
    </Box>
  );
};
