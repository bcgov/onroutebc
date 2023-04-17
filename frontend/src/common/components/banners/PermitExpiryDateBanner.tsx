import { Box, Typography } from "@mui/material";
import { BC_COLOURS } from "../../../themes/bcGovStyles";

export const PermitExpiryDateBanner = ({
  expiryDate,
}: {
  expiryDate: string;
}) => {
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
        width: "270px",
      }}
    >
      <div>
        <Typography variant="h5">PERMIT EXPIRY DATE</Typography>
        <Typography variant="h4">{expiryDate}</Typography>
      </div>
    </Box>
  );
};
