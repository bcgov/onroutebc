import { Box, Typography } from "@mui/material";
import { BC_COLOURS } from "../../../themes/bcGovStyles";

/**
 * React component that displays client name in a banner.
 * To be used in wizard.
 */
export const WizardClientBanner = ({ legalName }: { legalName: string }) => {
  return (
    <Box
      sx={{
        height: 100,
        backgroundColor: BC_COLOURS.banner_grey,
        color: BC_COLOURS.bc_primary_blue,
        marginTop: "20px",
        px: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div>
        <Typography variant="h5">CLIENT NAME</Typography>
        <Typography variant="h4">{legalName}</Typography>
      </div>
    </Box>
  );
};
