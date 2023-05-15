import { Box, Button, Typography } from "@mui/material";
import { useEffect } from "react";
import "./SuccessPage.scss";
import { useNavigate } from "react-router-dom";

export const SuccessPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();
  return (
    <Box className="success feature-container">
      <Box className="success__container">
        <Box className="success__block success__block--success-img">
          <img
            height="168"
            width="178"
            src="/Success_Graphic.png"
            alt="Profile Set-up Successful"
          />
        </Box>
        <Box className="success__block success__block--success-msg">
          <Typography variant="h4">Success</Typography>
        </Box>
        <Box className="success__block success__block--info">
          <Typography variant="body1">
            TODO: The permit(s) and receipt have been sent to the email/fax
            provided.
          </Typography>
        </Box>
        <Box className="success__block success__block--apply-permit">
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/applications")}
          >
            Apply for a new permit
          </Button>
        </Box>
        <Box className="success__block success__block--view-permits">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate("/applications")}
          >
            View Permits
          </Button>
          <Button
            sx={{ marginLeft: "24px" }}
            variant="contained"
            color="secondary"
          >
            View Receipts
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
