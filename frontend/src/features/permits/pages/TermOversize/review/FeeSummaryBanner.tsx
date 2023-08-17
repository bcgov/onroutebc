import { Box, Typography } from "@mui/material";
import { useContext } from "react";

import "./FeeSummaryBanner.scss";
import { ApplicationContext } from "../../../context/ApplicationContext";
import { getDefaultRequiredVal } from "../../../../../common/helpers/util";
import { permitTypeDisplayText } from "../../../helpers/mappers";
import { PermitType } from "../../../types/application";

export const FeeSummaryBanner = () => {
  const { applicationData } = useContext(ApplicationContext);
  const calculatedFee = Number(
    applicationData?.permitData.permitDuration
  );
  
  return (
    <Box className="fee-summary-banner">
      <Typography
        className="fee-summary-banner__title"
        variant="h4"
      >
        Fee Summary
      </Typography>
      <Box className="fee-summary-banner__header">
        <Typography variant="h6">Description</Typography>
        <Typography variant="h6">Amount</Typography>
      </Box>
      <Box className="fee-summary-banner__body">
        <Typography 
          variant="h6"
          data-testid="fee-summary-permit-type"
        >
          {permitTypeDisplayText(
            getDefaultRequiredVal("", applicationData?.permitType) as PermitType
          )}
        </Typography>
        <Typography 
          variant="h6"
          data-testid="fee-summary-price"
        >
          ${calculatedFee}.00
        </Typography>
      </Box>
      <Box className="fee-summary-banner__footer">
        <Typography variant="h4">Total (CAD)</Typography>
        <Typography 
          variant="h4"
          data-testid="fee-summary-total"
        >
          ${calculatedFee}.00
        </Typography>
      </Box>
    </Box>
  );
};
