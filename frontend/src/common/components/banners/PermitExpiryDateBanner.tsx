import { Box, Typography } from "@mui/material";

import "./PermitExpiryDateBanner.scss";

export const PermitExpiryDateBanner = ({
  expiryDate,
}: {
  expiryDate: string;
}) => {
  return (
    <Box className="permit-expiry-date-banner">
      <div>
        <Typography variant="h5">PERMIT EXPIRY DATE</Typography>
        <Typography variant="h4" data-testid="permit-expiry-date">
          {expiryDate}
        </Typography>
      </div>
    </Box>
  );
};
