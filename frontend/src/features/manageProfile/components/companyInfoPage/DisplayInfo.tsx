import { Box, Button, Typography } from "@mui/material";
import { memo } from "react";

import "./CompanyInfoPage.scss";

export const DisplayInfo = memo(
  ({
    setIsEditting,
  }: {
    setIsEditting: React.Dispatch<React.SetStateAction<boolean>>;
  }) => {
    return (
      <div className="display-info-container">
        <Box>
          <h2>Company Address</h2>
          <Typography>402 Robson Street</Typography>
          <Typography>Canada</Typography>
          <Typography>BC</Typography>
          <Typography>Vancouver V6B 3K9</Typography>
          <h2>Mailing Address</h2>
          <Typography>402 Robson Street</Typography>
          <Typography>Canada</Typography>
          <Typography>BC</Typography>
          <Typography>Vancouver V6B 3K9</Typography>
        </Box>
        <div>
          <Button
            variant="contained"
            color="secondary"
            sx={{ marginTop: "20px" }}
            onClick={() => setIsEditting(true)}
          >
            <i className="fa fa-pencil" style={{ marginRight: "7px" }}></i>
            Edit
          </Button>
        </div>
      </div>
    );
  }
);

DisplayInfo.displayName = "DisplayInfo";
