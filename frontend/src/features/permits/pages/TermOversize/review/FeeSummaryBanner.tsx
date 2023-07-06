import { Box, Typography } from "@mui/material";
import { useContext } from "react";

import "./FeeSummaryBanner.scss";
import { ApplicationContext } from "../../../context/ApplicationContext";

export const FeeSummaryBanner = () => {
  const { applicationData } = useContext(ApplicationContext);
  const calculatedFee = applicationData?.permitData.permitDuration || 0;
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
        <Typography variant="h6">Oversize: Term</Typography>
        <Typography variant="h6">${calculatedFee}.00</Typography>
      </Box>
      <Box className="fee-summary-banner__footer">
        <Typography variant="h4">Total (CAD)</Typography>
        <Typography variant="h4">${calculatedFee}.00</Typography>
      </Box>
    </Box>
  );
};
