import { Box, Button, Typography } from "@mui/material";
import { memo } from "react";

import "./ManageProfilePages.scss";

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
          <Typography>TODO - Display Data</Typography>
          <Typography>Click Edit to test form</Typography>
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
