import { Box, Typography } from "@mui/material";
import { BC_COLOURS } from "../../../../../themes/bcGovStyles";
import { useContext } from "react";
import { ApplicationContext } from "../../../context/ApplicationContext";

export const FeeSummaryBanner = () => {
  const { applicationData } = useContext(ApplicationContext);
  const calculatedFee = applicationData?.permitData.permitDuration || 0;
  return (
    <Box
      sx={{
        backgroundColor: BC_COLOURS.banner_grey,
        color: BC_COLOURS.bc_primary_blue,
        p: 3,
        width: "642px",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          paddingBottom: "8px",
        }}
      >
        Fee Summary
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          fontWeight: "bold",
          padding: "16px 0",
        }}
      >
        <Typography variant="h6">Description</Typography>
        <Typography variant="h6">Price ($CAD)</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "16px 0",
          borderTop: `2px solid ${BC_COLOURS.bc_text_box_border_grey}`,
          borderBottom: `2px solid ${BC_COLOURS.bc_text_box_border_grey}`,
        }}
      >
        <Typography variant="h6">Term Oversize Permit</Typography>
        <Typography variant="h6">${calculatedFee}.00</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          paddingTop: "16px",
        }}
      >
        <Typography variant="h4">Total</Typography>
        <Typography variant="h4">${calculatedFee}.00</Typography>
      </Box>
    </Box>
  );
};
