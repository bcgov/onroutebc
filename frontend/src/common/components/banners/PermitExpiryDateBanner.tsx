import { Controller, useFormContext } from "react-hook-form";
import { Box, Typography } from "@mui/material";

import "./PermitExpiryDateBanner.scss";

export const PermitExpiryDateBanner = ({
  expiryDate,
}: {
  expiryDate: string;
}) => {
  const { control } = useFormContext();
  
  return (
    <Controller
      name="permitData.expiryDate"
      control={control}
      render={() => (
        <Box className="permit-expiry-date-banner">
          <div>
            <Typography variant="h5">PERMIT EXPIRY DATE</Typography>
            <Typography variant="h4" data-testid="permit-expiry-date">
              {expiryDate}
            </Typography>
          </div>
        </Box>
      )}
    />
  );
};
